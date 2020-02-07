import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Challenge} from "../entity/Challenge";
import {ChallengeApplication, ValidationStatus} from "../entity/ChallengeApplication";
import {ChallengeRepository} from "../repository/ChallengeRepository";
import {ChallengeApplicationRequest} from "../payload/ChallengeApplicationRequest";
import {UsersService} from "../../users/service/UsersService";
import {TooManyWaitingApplicationsError} from "../error/TooManyWaitingApplicationsError";
import {TooManyRejectedApplicationsError} from "../error/TooManyRejectedApplicationsError";
import {AlreadyAcceptedChallengeError} from "../error/AlreadyAcceptedChallengeError";
import {ChallengeOutOfTimeframeError} from "../error/ChallengeOutOfTimeframeError";
import {RejectApplicationRequest} from "../payload/RejectApplicationRequest";
import {Rankable} from "../../users/entity/Rankable";
import {Repository} from "typeorm";
import {NotParticipantError} from "../../core/error/NotParticipantError";
import {GroupChallengePoll} from "../entity/GroupChallengePoll";
import {PollRepository} from "../repository/PollRepository";
import {GroupAlreadyHasPoll} from "../error/GroupAlreadyHasPoll";
import {Group} from "../../users/entity/Group";
import {NotAnOwnerError} from "../../core/error/NotAnOwnerError";
import {ChallengeCreateRequest} from "../payload/ChallengeCreateRequest";

@Injectable()
export class ChallengeService {
    private static MAX_ALLOWED_WAITING_APPLICATIONS: number = 5;
    private static MAX_ALLOWED_REJECTED_APPLICATIONS: number = 3;
    private static MIN_NEEDED_VOTES_PERCENTAGE: number = 51;

    constructor(
        @InjectRepository(Challenge) private readonly challengeRepository: ChallengeRepository,
        @InjectRepository(Rankable) private readonly rankableRepsitory: Repository<Rankable>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(GroupChallengePoll) private readonly pollRepository: PollRepository,
        private readonly usersService: UsersService
    ) {
    }

    async create(request: ChallengeCreateRequest, isAdmin: boolean): Promise<Challenge> {
        const challenge = new Challenge();
        challenge.name = request.name;
        challenge.points = request.points;
        challenge.description = request.description;
        challenge.startsOn = request.startsOn;
        challenge.endsOn = request.endsOn;
        challenge.validationStatus = isAdmin ? ValidationStatus.ACCEPTED : ValidationStatus.PENDING;

        return this.challengeRepository.save(challenge);
    }

    async findAllAccepted(): Promise<Challenge[]> {
        return this.challengeRepository.findAllAccepted();
    }

    async findAllWaiting(): Promise<Challenge[]> {
        return this.challengeRepository.findAllWaiting();
    }

    async findWaitingApplications(): Promise<ChallengeApplication[]> {
        return this.challengeRepository.findWaitingApplications();
    }

    async findByUser(userId: number, validationStatus: number): Promise<Challenge[]> {
        return this.challengeRepository.findByUser(userId, ChallengeService.getStatus(validationStatus));
    }

    async findApplicationsByUser(userId: number, validationStatus: number): Promise<ChallengeApplication[]> {
        return this.challengeRepository.findApplicationsByUser(userId, ChallengeService.getStatus(validationStatus));
    }

    async createPoll(groupId: number, userId: number, challengeId: number): Promise<GroupChallengePoll> {
        const user = await this.usersService.find(userId);
        if (!user.groups.some(g => g.id === groupId)) {
            throw new NotParticipantError();
        }

        const hasPoll = !!(await this.pollRepository.findByChallengeAndGroup(groupId, challengeId));
        if (hasPoll) {
            throw new GroupAlreadyHasPoll();
        }

        return this.pollVote(challengeId, groupId, userId, true);
    }

    async canGroupApply(groupId: number, challengeId: number): Promise<boolean> {
        const poll = await this.pollRepository.findByChallengeAndGroup(groupId, challengeId);
        if (!poll) {
            return false;
        }

        const group = await this.groupRepository.findOne(groupId);
        const userCount = group.users.length;
        const positiveVotes = poll.map(vote => vote.isAccepted).filter(vote => vote).length;

        return ((positiveVotes / userCount) * 100) >= ChallengeService.MIN_NEEDED_VOTES_PERCENTAGE;
    }

    async pollVote(challengeId: number, groupId: number, userId: number, vote: boolean): Promise<GroupChallengePoll> {
        const poll = new GroupChallengePoll();
        poll.challenge = await this.challengeRepository.findOne(challengeId);
        poll.groupId = groupId;
        poll.user = await this.usersService.find(userId);
        poll.isAccepted = vote;

        return this.pollRepository.save(poll);
    }

    async getGroupPoll(groupId: number, challengeId: number, userId: number): Promise<GroupChallengePoll[]> {
        const user = await this.usersService.find(userId);
        if (!user.groups.some(g => g.id === groupId)) {
            throw new NotAnOwnerError();
        }

        return this.pollRepository.findByChallengeAndGroup(groupId, challengeId);
    }

    async apply(doerId: number, challengeId: number, applicationRequest: ChallengeApplicationRequest)
        : Promise<ChallengeApplication> {
        await this.checkWaitingThreshold(doerId, challengeId);
        await this.checkRejectedThreshold(doerId, challengeId);
        await this.checkAccepted(doerId, challengeId);

        const challenge = await this.getTimeframedChallenge(challengeId);

        const application = new ChallengeApplication();
        application.challenge = challenge;
        application.validationStatus = ValidationStatus.PENDING;
        application.doer = await this.rankableRepsitory.findOne(doerId);
        application.proofDescription = applicationRequest.proofDescription;
        application.proofUrl = applicationRequest.proofUrl;

        return this.challengeRepository.save(application);
    }

    async acceptApplication(applicationId: number): Promise<ChallengeApplication> {
        const application = await this.challengeRepository.findApplicationById(applicationId);
        application.validationStatus = ValidationStatus.ACCEPTED;
        application.doer.points += application.challenge.points;

        await this.rankableRepsitory.save(application.doer);

        return this.challengeRepository.saveApplication(application);
    }

    async rejectApplication(applicationId: number, reason: RejectApplicationRequest): Promise<ChallengeApplication> {
        const application = await this.challengeRepository.findApplicationById(applicationId);
        application.validationStatus = ValidationStatus.REJECTED;
        application.validationDescription = reason.description;

        return this.challengeRepository.saveApplication(application);
    }

    async acceptChallenge(challengeId: number): Promise<Challenge> {
        const challenge = await this.challengeRepository.findOne(challengeId);
        challenge.validationStatus = ValidationStatus.ACCEPTED;

        return this.challengeRepository.save(challenge);
    }

    async rejectChallenge(challengeId: number): Promise<Challenge> {
        const challenge = await this.challengeRepository.findOne(challengeId);
        challenge.validationStatus = ValidationStatus.REJECTED;

        return this.challengeRepository.save(challenge);
    }

    private static getStatus(validationStatus: number): ValidationStatus {
        let status = ValidationStatus.REJECTED;
        if (validationStatus === ValidationStatus.PENDING) {
            status = ValidationStatus.PENDING;
        } else if (validationStatus === ValidationStatus.ACCEPTED) {
            status = ValidationStatus.ACCEPTED;
        }

        return status;
    }

    private async checkWaitingThreshold(doerId: number, challengeId: number) {
        const waiting = await this.challengeRepository.findApplicationsByUserAndChallenge(
            doerId,
            challengeId,
            ValidationStatus.PENDING
        );

        if (waiting.length >= ChallengeService.MAX_ALLOWED_WAITING_APPLICATIONS) {
            throw new TooManyWaitingApplicationsError();
        }
    }

    private async checkRejectedThreshold(doerId: number, challengeId: number) {
        const rejected = await this.challengeRepository.findApplicationsByUserAndChallenge(
            doerId,
            challengeId,
            ValidationStatus.REJECTED
        );

        if (rejected.length >= ChallengeService.MAX_ALLOWED_REJECTED_APPLICATIONS) {
            throw new TooManyRejectedApplicationsError();
        }
    }

    private async checkAccepted(doerId: number, challengeId: number) {
        const accepted = await this.challengeRepository.findApplicationsByUserAndChallenge(
            doerId,
            challengeId,
            ValidationStatus.ACCEPTED
        );

        if (accepted.length >= 1) {
            throw new AlreadyAcceptedChallengeError();
        }
    }

    private async getTimeframedChallenge(challengeId: number): Promise<Challenge> {
        const challenge = await this.challengeRepository.findOne(challengeId);
        const now = new Date();

        if (now.getTime() < challenge.startsOn.getTime() || now.getTime() > challenge.endsOn.getTime()) {
            throw new ChallengeOutOfTimeframeError();
        }

        return challenge;
    }


}

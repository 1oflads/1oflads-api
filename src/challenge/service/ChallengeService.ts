import {Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Challenge} from "../entity/Challenge";
import {ChallengeApplication} from "../entity/ChallengeApplication";
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
import {ValidationStatus} from "../entity/ValidationStatus";
import {ChallengeApplicationRepository} from "../repository/ChallengeApplicationRepository";
import FileConfig from "../../config/FileConfig";
import {ConfigType} from "@nestjs/config";
import * as fs from "fs";
import {ChallengeApplicationViewModel} from "../entity/ChallengeApplicationViewModel";
import {GroupApplicationCandidate} from "../entity/GroupApplicationCandidate";
import {wheat} from "color-name";

@Injectable()
export class ChallengeService {
    private static MAX_ALLOWED_WAITING_APPLICATIONS: number = 5;
    private static MAX_ALLOWED_REJECTED_APPLICATIONS: number = 3;
    private static MIN_NEEDED_VOTES_PERCENTAGE: number = 51;

    constructor(
        @InjectRepository(Challenge) private readonly challengeRepository: ChallengeRepository,
        @InjectRepository(ChallengeApplication) private readonly applicationRepository: ChallengeApplicationRepository,
        @InjectRepository(Rankable) private readonly rankableRepsitory: Repository<Rankable>,
        @InjectRepository(GroupApplicationCandidate) private readonly groupAppCandidateRepository: Repository<GroupApplicationCandidate>,
        @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
        @InjectRepository(PollRepository) private readonly pollRepository: PollRepository,
        @Inject(FileConfig.KEY) private readonly fileConfig: ConfigType<typeof FileConfig>,
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

        console.log(this.challengeRepository.target);
        console.log(this.pollRepository.target);

        return this.challengeRepository.save(challenge);
    }

    async findAllAccepted(): Promise<Challenge[]> {
        return this.challengeRepository.findAllAccepted();
    }

    async findAllWaiting(): Promise<Challenge[]> {
        return this.challengeRepository.findAllWaiting();
    }

    async findWaitingApplications(): Promise<ChallengeApplicationViewModel[]> {
        return (await this.applicationRepository.findWaiting())
            .map(c => new ChallengeApplicationViewModel(
                c.id,
                c.challenge,
                c.completedOn,
                c.proofDescription,
                c.proofUrl
            ));
    }

    async findByUser(userId: number, validationStatus: number): Promise<Challenge[]> {
        return this.applicationRepository.findChallengesByUser(userId, ChallengeService.getStatus(validationStatus));
    }

    async findApplicationsByGroup(groupId: number, userId: number, validationStatus: number) {
        const user = await this.usersService.find(userId);
        if (!((await user.groups).some(g => g.id == groupId))) {
            throw new NotParticipantError();
        }

        return this.findApplicationsByUser(groupId, validationStatus);
    }

    async findApplicationsByUser(userId: number, validationStatus: number): Promise<ChallengeApplicationViewModel[]> {

        let challengeApplications = await this.applicationRepository.findByUser(userId, ChallengeService.getStatus(validationStatus))

        return challengeApplications.map(ca => new ChallengeApplicationViewModel(
            ca.id,
            ca.challenge,
            ca.completedOn,
            ca.proofDescription,
            ca.proofUrl
        ))
    }

    async createPoll(candidateId: number, userId: number): Promise<GroupChallengePoll> {
        const candidate = this.groupAppCandidateRepository.findOne(candidateId);
        const resolvedCandidate = await candidate;
        const groupId = resolvedCandidate.groupId;
        const user = await this.usersService.find(userId);
        if (!((await user.groups).some(g => g.id == groupId))) {
            throw new NotParticipantError();
        }

        const polls = (await this.pollRepository.findByCandidate(candidate));
        const hasPoll = polls.length > 0;
        if (hasPoll) {
            throw new GroupAlreadyHasPoll();
        }

        return this.pollVote(candidateId, userId, true);
    }

    async canGroupApply(groupId: number, challengeId: number): Promise<boolean> {
        const candidate = this.groupAppCandidateRepository.findOne(
            {
                where: {
                    group: this.findGroup(groupId),
                    challenge: this.challengeRepository.findOne(challengeId)
                },
                order: {
                    id: "DESC"
                }
            }
        );

        const polls = await this.pollRepository.findByCandidate(candidate);
        if (!polls || polls.length == 0) {
            return false;
        }

        return await this.isVotesThresholdMet(groupId, polls);
    }

    private async isVotesThresholdMet(groupId: number, poll): Promise<boolean> {
        const group = await this.findGroup(groupId);
        const userCount = (await group.users).length;
        console.log(poll);
        const positiveVotes = poll.map(vote => vote.isAccepted).filter(vote => vote).length;

        return ((positiveVotes / userCount) * 100) >= ChallengeService.MIN_NEEDED_VOTES_PERCENTAGE;
    }

    async pollVote(candidateId: number, userId: number, vote: boolean): Promise<GroupChallengePoll> {
        const poll = new GroupChallengePoll();
        await (poll.applicationCandidate = this.groupAppCandidateRepository.findOne(candidateId));
        await (poll.user = this.usersService.find(userId));
        poll.isAccepted = vote;
        await this.pollRepository.save(poll);

        const candidate = (await poll.applicationCandidate);
        const groupId = candidate.groupId;
        const challengeId = (await candidate.challenge).id;

        await this.isVotesThresholdMet(
            groupId,
            await this.pollRepository.findByCandidate(poll.applicationCandidate)
        )
        && await this.convertGroupCandidateToApplication(
            groupId,
            challengeId
        );

        return poll;
    }

    async getGroupPoll(groupId: number, challengeId: number, userId: number): Promise<GroupChallengePoll[]> {
        const challenge = this.challengeRepository.findOne(challengeId);
        const candidate = this.groupAppCandidateRepository.findOne({
            where: {
                groupId: groupId,
                challenge: challenge
            },
            order: {
                id: "DESC"
            }
        });

        const user = await this.usersService.find(userId);
        if (!((await user.groups).some(async g => g.id == (await candidate).groupId))) {
            throw new NotAnOwnerError();
        }

        return this.pollRepository.findByCandidate(candidate);
    }

    async apply(doerId: number, challengeId: number, applicationRequest: ChallengeApplicationRequest, proof)
        : Promise<ChallengeApplication> {
        console.log(doerId);
        console.log(challengeId);
        console.log(applicationRequest);
        await this.checkWaitingThreshold(doerId, challengeId);
        await this.checkRejectedThreshold(doerId, challengeId);
        await this.checkAccepted(doerId, challengeId);

        const challenge = await this.getTimeframedChallenge(challengeId);

        const application = new ChallengeApplication();
        application.challenge = challenge;
        application.validationStatus = ValidationStatus.PENDING;
        application.doer = await this.rankableRepsitory.findOne(doerId);
        application.proofDescription = applicationRequest.proofDescription;

        this.tryUploadProof(proof, application);

        return this.applicationRepository.save(application);
    }

    async findGroupCandidates(groupId: number, userId: number): Promise<GroupApplicationCandidate[]> {
        const user = await this.usersService.find(userId);
        if (!((await user.groups).some(g => g.id == groupId))) {
            throw new NotParticipantError();
        }

        const candidates = this.groupAppCandidateRepository.find(
            {
                where: {
                    groupId: groupId
                }
            }
        );

        return candidates;
    }

    async acceptApplication(applicationId: number): Promise<ChallengeApplication> {
        const application = await this.applicationRepository.findOne(applicationId);
        application.validationStatus = ValidationStatus.ACCEPTED;
        application.doer.points += application.challenge.points;

        await this.rankableRepsitory.save(application.doer);

        return this.applicationRepository.save(application);
    }

    async rejectApplication(applicationId: number, reason: RejectApplicationRequest): Promise<ChallengeApplication> {
        const application = await this.applicationRepository.findOne(applicationId);
        application.validationStatus = ValidationStatus.REJECTED;
        application.validationDescription = reason.description;

        return this.applicationRepository.save(application);
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


    async convertGroupCandidateToApplication(
        groupId: number,
        challengeId: number
    ): Promise<ChallengeApplication> {
        const applicationCandidate = await this.groupAppCandidateRepository.findOne(
            {
                where: {
                    groupId: groupId,
                    challenge: this.challengeRepository.findOne(challengeId)
                },
                order: {
                    id: "DESC"
                }
            }
        );

        const challengeApplication = new ChallengeApplication();
        challengeApplication.doer = await this.findGroup((await applicationCandidate).groupId);
        challengeApplication.challenge = await applicationCandidate.challenge;
        challengeApplication.proofDescription = applicationCandidate.proofDescription;
        challengeApplication.proofUrl = applicationCandidate.proofUrl;
        challengeApplication.validationStatus = ValidationStatus.PENDING;


        return this.applicationRepository.save(challengeApplication);
    }

    async canGroupCandidate(groupId: number, challengeId: number): Promise<boolean> {
        await this.checkWaitingThreshold(groupId, challengeId);
        await this.checkRejectedThreshold(groupId, challengeId);
        await this.checkAccepted(groupId, challengeId);
        const candidates = await this.groupAppCandidateRepository.find(
            {
                where: {
                    groupId: groupId,
                    challenge: this.challengeRepository.findOne(challengeId)
                }
            }
        );

        const group = await this.findGroup(groupId);
        const users = await group.users;
        for (const candidate of candidates) {
            const votes = (await candidate.polls);
            if (votes.length < (users.length / 2)) {
                return false;
            }
        }

        return true;
    }

    async candidateGroup(
        groupId: number,
        challengeId: number,
        request: ChallengeApplicationRequest,
        userId: number,
        proof
    ): Promise<any> {
        const user = await this.usersService.find(userId);
        console.log(groupId);
        if (!((await user.groups).some(g => g.id == groupId))) {
            throw new NotParticipantError();
        }

        const candidate = new GroupApplicationCandidate();
        candidate.groupId = groupId;
        await (candidate.challenge = this.challengeRepository.findOne(challengeId));
        candidate.proofDescription = request.proofDescription;

        this.tryUploadProof(proof, candidate);

        await this.groupAppCandidateRepository.save(candidate);
        await this.createPoll(candidate.id, userId);

        return candidate;
    }

    private static getStatus(validationStatus: number): ValidationStatus {
        let status = ValidationStatus.REJECTED;
        if (validationStatus == ValidationStatus.PENDING.valueOf()) {
            status = ValidationStatus.PENDING;
        } else if (validationStatus == ValidationStatus.ACCEPTED.valueOf()) {
            status = ValidationStatus.ACCEPTED;
        }

        return status;
    }

    private async checkWaitingThreshold(doerId: number, challengeId: number) {
        const waiting = await this.applicationRepository.findByUserAndChallenge(
            doerId,
            challengeId,
            ValidationStatus.PENDING
        );

        if (waiting.length >= ChallengeService.MAX_ALLOWED_WAITING_APPLICATIONS) {
            throw new TooManyWaitingApplicationsError();
        }
    }

    private async checkRejectedThreshold(doerId: number, challengeId: number) {
        const rejected = await this.applicationRepository.findByUserAndChallenge(
            doerId,
            challengeId,
            ValidationStatus.REJECTED
        );

        if (rejected.length >= ChallengeService.MAX_ALLOWED_REJECTED_APPLICATIONS) {
            throw new TooManyRejectedApplicationsError();
        }
    }

    private async checkAccepted(doerId: number, challengeId: number) {
        const accepted = await this.applicationRepository.findByUserAndChallenge(
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

        if (challenge.startsOn && challenge.endsOn) {
            if (now.getTime() < challenge.startsOn.getTime() || now.getTime() > challenge.endsOn.getTime()) {
                throw new ChallengeOutOfTimeframeError();
            }
        }

        return challenge;
    }

    private tryUploadProof(proof, application: { proofUrl }) {
        if (proof !== undefined) {
            const now = new Date();
            fs.writeFileSync(
                this.fileConfig.destination + now.getTime() + proof.originalname,
                proof.buffer
            );
            application.proofUrl = this.fileConfig.staticRoot + encodeURIComponent(now.getTime() + proof.originalname);
        }
    }

    private async findGroup(id: number): Promise<Group> {
        return this.groupRepository.findOne({
            where: {
                groupId: id
            }
        });
    }

}

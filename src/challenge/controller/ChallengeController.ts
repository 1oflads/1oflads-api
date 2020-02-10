import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {Challenge} from "../entity/Challenge";
import {ChallengeService} from "../service/ChallengeService";
import {ChallengeApplication} from "../entity/ChallengeApplication";
import {RejectApplicationRequest} from "../payload/RejectApplicationRequest";
import {AuthPrincipal, Public} from "../../auth/decorator/AuthDecorator";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {ChallengeApplicationRequest} from "../payload/ChallengeApplicationRequest";
import {GroupChallengePoll} from "../entity/GroupChallengePoll";
import {GroupPollVoteRequest} from "../payload/GroupPollVoteRequest";
import {GroupNeedsPollOrQuorumError} from "../error/GroupNeedsPollOrQuorumError";
import {ChallengeCreateRequest} from "../payload/ChallengeCreateRequest";
import {ChallengeApplicationViewModel} from "../entity/ChallengeApplicationViewModel";
import {ImageUpload} from "../../core/decorator/CoreDecorator";
import {ValidationStatus} from "../entity/ValidationStatus";

@Controller("/challenges")
export class ChallengeController {

    constructor(
        private readonly challengeService: ChallengeService
    ) {
    }

    @Post()
    async create(@Body() request: ChallengeCreateRequest, @AuthPrincipal() user: UserStrippedDTO): Promise<Challenge> {
        return this.challengeService.create(request, user.isAdmin);
    }

    @Get()
    @Public()
    async all(): Promise<Challenge[]> {
        return this.challengeService.findAllAccepted();
    }

    @Get("/waiting")
    async waiting(): Promise<Challenge[]> {
        return this.challengeService.findAllWaiting();
    }

    @Get("/groups/:id/waiting")
    async groupWaiting(@Param() groupId: number, @AuthPrincipal() user: UserStrippedDTO) {
        return this.challengeService.findApplicationsByGroup(
            groupId,
            user.id,
            ValidationStatus.PENDING
        );
    }

    @Get("/groups/:id/accepted")
    async groupAccepted(@Param() groupId: number, @AuthPrincipal() user: UserStrippedDTO) {
        return this.challengeService.findApplicationsByGroup(
            groupId,
            user.id,
            ValidationStatus.ACCEPTED
        );
    }

    @Get("/groups/:id/rejected")
    async groupRejected(@Param() groupId: number, @AuthPrincipal() user: UserStrippedDTO) {
        return this.challengeService.findApplicationsByGroup(
            groupId,
            user.id,
            ValidationStatus.REJECTED
        );
    }

    @Get("/groups/:id/candidates")
    async groupCandidates(@Param() groupId: number, @AuthPrincipal() user: UserStrippedDTO) {
        return this.challengeService.findGroupCandidates(
            groupId,
            user.id
        );
    }


    @Patch("/:id/accept")
    async accept(@Param("id") challengeId: number): Promise<Challenge> {
        return this.challengeService.acceptChallenge(challengeId);
    }

    @Patch("/:id/reject")
    async reject(@Param("id") challengeId: number): Promise<Challenge> {
        return this.challengeService.rejectChallenge(challengeId);
    }

    @Get("/applications/waiting")
    async getWaitingApplications(): Promise<ChallengeApplicationViewModel[]> {
        return this.challengeService.findWaitingApplications();
    }

    @Patch("/applications/:id/accept")
    async acceptApplication(@Param("id") applicationId: number): Promise<ChallengeApplication> {
        return this.challengeService.acceptApplication(applicationId);
    }

    @Get("/applications/:id/:status")
    async getUserApplicationsByStatus(@Param("id") userId: number, @Param("status") status: number): Promise<ChallengeApplicationViewModel[]> {
        return this.challengeService.findApplicationsByUser(userId, status);
    }

    @Patch("/applications/:id/reject")
    async rejectApplication(@Param("id") applicationId: number, @Body() reason: RejectApplicationRequest)
        : Promise<ChallengeApplication> {
        return this.challengeService.rejectApplication(applicationId, reason);
    }

    @Post("/:id/applications")
    @UseInterceptors(ImageUpload("proof"))
    async applyForChallenge(@Param("id") challengeId: number,
                            @AuthPrincipal() user: UserStrippedDTO,
                            @Body() request: ChallengeApplicationRequest,
                            @UploadedFile() proof
    ): Promise<ChallengeApplication> {
        if (request
            .groupId > 0 && (await this.challengeService.canGroupCandidate(request.groupId, challengeId))
        ) {
            return this.challengeService.candidateGroup(
                request.groupId,
                challengeId,
                request,
                user.id,
                proof
            );
        }

        if (request.groupId > 0 && !(await this.challengeService.canGroupApply(request.groupId, challengeId))) {
            return this.challengeService.convertGroupCandidateToApplication(
                request.groupId,
                challengeId
            );
        }

        return this.challengeService.apply(
            request.groupId > 0 ? request.groupId : user.id,
            challengeId,
            request,
            proof
        );
    }

    @Patch("/:id/groupPoll/:candidateId")
    async voteGroupPoll(
        @Param("id") challengeId: number,
        @Param("candidateId") candidateId: number,
        @AuthPrincipal() user: UserStrippedDTO,
        @Body() groupPollVoteRequest: GroupPollVoteRequest
    ): Promise<GroupChallengePoll> {
        return this.challengeService.pollVote(
            candidateId,
            user.id,
            groupPollVoteRequest.answer
        );
    }

    @Get("/:id/groupPollResult/:groupId")
    async getGroupPollResult(
        @Param("id") challengeId: number,
        @Param("groupId") groupId: number,
        @AuthPrincipal() user: UserStrippedDTO
    ): Promise<GroupChallengePoll[]> {
        return this.challengeService.getGroupPoll(groupId, challengeId, user.id);
    }
}

import {Body, Controller, Get, Param, Patch, Post, Query} from "@nestjs/common";
import {Challenge} from "../entity/Challenge";
import {ChallengeService} from "../service/ChallengeService";
import {ChallengeApplication} from "../entity/ChallengeApplication";
import {RejectApplicationRequest} from "../payload/RejectApplicationRequest";
import {AuthPrincipal} from "../../auth/decorator/AuthDecorator";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {ChallengeApplicationRequest} from "../payload/ChallengeApplicationRequest";
import {GroupChallengePoll} from "../entity/GroupChallengePoll";
import {GroupPollVoteRequest} from "../payload/GroupPollVoteRequest";
import {GroupNeedsPollOrQuorumError} from "../error/GroupNeedsPollOrQuorumError";
import {ChallengeCreateRequest} from "../payload/ChallengeCreateRequest";

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
    async filterAll(@Query("type") type: string): Promise<Challenge[]> {
        if (type === 'waiting') {
            return this.challengeService.findAllWaiting();
        }

        return this.challengeService.findAllAccepted();
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
    async getWaitingApplications(): Promise<ChallengeApplication[]> {
        return this.challengeService.findWaitingApplications();
    }

    @Patch("/applications/:id/accept")
    async acceptApplication(@Param("id") applicationId: number): Promise<ChallengeApplication> {
        return this.challengeService.acceptApplication(applicationId)
    }

    @Patch("/applications/:id/reject")
    async rejectApplication(
        @Param("id") applicationId: number,
        @Body() reason: RejectApplicationRequest
    ): Promise<ChallengeApplication> {
        return this.challengeService.rejectApplication(applicationId, reason);
    }

    @Post("/:id/application")
    async applyForChallenge(
        @Param("id") challengeId: number,
        @AuthPrincipal() user: UserStrippedDTO,
        @Body() request: ChallengeApplicationRequest
    ): Promise<ChallengeApplication> {
        if (request.groupId && !(await this.challengeService.canGroupApply(request.groupId, challengeId))) {
            throw new GroupNeedsPollOrQuorumError();
        }

        return this.challengeService.apply(
            request.groupId || user.id,
            challengeId,
            request
        );
    }

    @Post("/:id/groupPoll/:groupId")
    async initGroupPoll(
        @Param("id") challengeId: number,
        @Param("groupId") groupId: number,
        @AuthPrincipal() user: UserStrippedDTO
    ): Promise<GroupChallengePoll> {
        return this.challengeService.createPoll(
            groupId,
            user.id,
            challengeId
        );
    }

    @Patch("/:id/groupPoll/:groupId")
    async voteGroupPoll(
        @Param("id") challengeId: number,
        @Param("groupId") groupId: number,
        @AuthPrincipal() user: UserStrippedDTO,
        @Body() groupPollVoteRequest: GroupPollVoteRequest
    ): Promise<GroupChallengePoll> {
        return this.challengeService.pollVote(
            challengeId,
            groupId,
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

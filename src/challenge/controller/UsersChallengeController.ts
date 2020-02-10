import {Controller, Get, Query} from "@nestjs/common";
import {AuthPrincipal} from "../../auth/decorator/AuthDecorator";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {Challenge} from "../entity/Challenge";
import {ChallengeApplication} from "../entity/ChallengeApplication";
import {ChallengeService} from "../service/ChallengeService";
import {ChallengeApplicationViewModel} from "../entity/ChallengeApplicationViewModel";

@Controller()
export class UsersChallengeController {

    constructor(
        private readonly challengeService: ChallengeService
    ) {
    }

    @Get("/users/challenges")
    async myChallenges(@AuthPrincipal() user: UserStrippedDTO, @Query("status") status: number)
        : Promise<Challenge[]> {
        return this.challengeService.findByUser(user.id, status);
    }

    @Get("/users/challengeApplications")
    async myChallengeApplications(@AuthPrincipal() user: UserStrippedDTO, @Query("status") status: number)
        : Promise<ChallengeApplicationViewModel[]> {
        return this.challengeService.findApplicationsByUser(user.id, status);
    }
}

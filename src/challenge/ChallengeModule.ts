import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entity/User";
import {Group} from "../users/entity/Group";
import {Rankable} from "../users/entity/Rankable";
import {Role} from "../users/entity/Role";
import {Challenge} from "./entity/Challenge";
import {ChallengeApplication} from "./entity/ChallengeApplication";
import {UserRepository} from "../users/repository/UserRepository";
import {GroupChallengePoll} from "./entity/GroupChallengePoll";
import {ChallengeRepository} from "./repository/ChallengeRepository";
import {PollRepository} from "./repository/PollRepository";
import {ChallengeService} from "./service/ChallengeService";
import {ChallengeController} from "./controller/ChallengeController";
import {UserModule} from "../users/UserModule";
import {UsersService} from "../users/service/UsersService";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Group,
            Rankable,
            Role,
            Challenge,
            ChallengeApplication,
            GroupChallengePoll,
            UserRepository,
            ChallengeRepository,
            PollRepository
        ]),
    ],
    providers: [UsersService, ChallengeService],
    exports: [ChallengeService],
    controllers: [ChallengeController]
})
export class ChallengeModule {
}

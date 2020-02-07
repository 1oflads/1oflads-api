import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {UsersController} from "./controller/UsersController";
import {User} from "./entity/User";
import {UsersService} from "./service/UsersService";
import {UserRepository} from "./repository/UserRepository";
import {Group} from "./entity/Group";
import {Role} from "./entity/Role";
import {Challenge} from "../challenge/entity/Challenge";
import {ChallengeApplication} from "../challenge/entity/ChallengeApplication";
import {Rankable} from "./entity/Rankable";
import {GroupChallengePoll} from "../challenge/entity/GroupChallengePoll";
import {ChallengeRepository} from "../challenge/repository/ChallengeRepository";
import {PollRepository} from "../challenge/repository/PollRepository";

@Module({
    imports: [TypeOrmModule.forFeature([
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
    ])],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UserModule {

}

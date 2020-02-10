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
import {ConfigModule} from "@nestjs/config";
import FileConfig from "../config/FileConfig";
import {UserRoleHistory} from "./entity/UserRoleHistory";
import {RolesController} from "./controller/RolesController";
import {GroupsController} from "./controller/GroupsController";
import {Sphere} from "./entity/Sphere";
import {SpheresController} from "./controller/SpheresController";
import {GroupRoleRestriction} from "./entity/GroupRoleRestriction";
import {GroupCalendar} from "./entity/GroupCalendar";
import {ChallengeService} from "../challenge/service/ChallengeService";
import {UserSphere} from "./entity/UserSphere";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [FileConfig]
        }),
        TypeOrmModule.forFeature([
            User,
            UserRoleHistory,
            Group,
            Sphere,
            Rankable,
            Role,
            Challenge,
            UserSphere,
            ChallengeApplication,
            GroupChallengePoll,
            GroupCalendar,
            GroupRoleRestriction,
            UserRepository,
            ChallengeRepository,
            PollRepository
        ])],
    providers: [UsersService],
    controllers: [UsersController, RolesController, GroupsController, SpheresController]
})
export class UserModule {

}

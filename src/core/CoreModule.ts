import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {GroupChallengePoll} from "../challenge/entity/GroupChallengePoll";
import {ChallengeRepository} from "../challenge/repository/ChallengeRepository";
import {PollRepository} from "../challenge/repository/PollRepository";
import {ConfigModule} from "@nestjs/config";
import FileConfig from "../config/FileConfig";
import {UserRoleHistory} from "../users/entity/UserRoleHistory";
import {Role} from "../users/entity/Role";
import {Group} from "../users/entity/Group";
import {UserRepository} from "../users/repository/UserRepository";
import {Rankable} from "../users/entity/Rankable";
import {ChallengeApplication} from "../challenge/entity/ChallengeApplication";
import {Challenge} from "../challenge/entity/Challenge";
import {User} from "../users/entity/User";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [FileConfig]
        }),
        TypeOrmModule.forFeature([
            User,
            UserRoleHistory,
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
    providers: [],
    controllers: []
})
export class CoreModule {

}

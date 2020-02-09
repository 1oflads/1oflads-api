import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {UserModule} from "./users/UserModule";
import {User} from "./users/entity/User";
import {AuthModule} from "./auth/AuthModule";
import {Group} from "./users/entity/Group";
import {Rankable} from "./users/entity/Rankable";
import {Role} from "./users/entity/Role";
import { ChallengeModule } from './challenge/ChallengeModule';
import {Challenge} from "./challenge/entity/Challenge";
import {ChallengeApplication} from "./challenge/entity/ChallengeApplication";
import {GroupChallengePoll} from "./challenge/entity/GroupChallengePoll";
import {UserRoleHistory} from "./users/entity/UserRoleHistory";
import {ConfigModule} from "@nestjs/config";
import FileConfig from "./config/FileConfig";
import {RoleTheme} from "./users/entity/RoleTheme";
import {ArticleModule} from "./articles/ArticleModule";
import {Article} from "./articles/entity/Article";
import {Sphere} from "./users/entity/Sphere";
import {CoreModule} from "./core/CoreModule";
import {GroupCalendar} from "./users/entity/GroupCalendar";
import {GroupRoleRestriction} from "./users/entity/GroupRoleRestriction";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [FileConfig],
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: '1oflads',
            entities: [User, Group, Rankable, Role, Challenge, UserRoleHistory, ChallengeApplication, GroupChallengePoll, RoleTheme, Article, Sphere, GroupCalendar, GroupRoleRestriction],
            synchronize: true,
        }),
        UserModule,
        AuthModule,
        ChallengeModule,
        ArticleModule,
        CoreModule,
        ChallengeModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor(private readonly connection: Connection) {
    }
}

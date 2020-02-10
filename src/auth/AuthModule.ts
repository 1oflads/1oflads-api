import {Module} from "@nestjs/common";
import {AuthService} from "./service/AuthService";
import {JWTAuthStrategy} from "./service/JWTAuthStrategy";
import {jwtConstants} from "./ConfigConstants";
import {JwtModule} from '@nestjs/jwt';
import {UsersService} from "../users/service/UsersService";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entity/User";
import {UserRepository} from "../users/repository/UserRepository";
import {AuthController} from "./controller/AuthController";
import {Group} from "../users/entity/Group";
import {Rankable} from "../users/entity/Rankable";
import {Role} from "../users/entity/Role";
import {Challenge} from "../challenge/entity/Challenge";
import {ChallengeApplication} from "../challenge/entity/ChallengeApplication";
import {GroupChallengePoll} from "../challenge/entity/GroupChallengePoll";
import {ChallengeRepository} from "../challenge/repository/ChallengeRepository";
import {PollRepository} from "../challenge/repository/PollRepository";
import {UserRoleHistory} from "../users/entity/UserRoleHistory";
import {Sphere} from "../users/entity/Sphere";
import {GroupCalendar} from "../users/entity/GroupCalendar";
import {GroupRoleRestriction} from "../users/entity/GroupRoleRestriction";
import {UserSphere} from "../users/entity/UserSphere";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '168h'},
        }),
        TypeOrmModule.forFeature([
            User,
            UserRoleHistory,
            Group,
            Rankable,
            Role,
            Sphere,
            Challenge,
            ChallengeApplication,
            GroupChallengePoll,
            UserRepository,
            ChallengeRepository,
            PollRepository,
            GroupCalendar,
            GroupRoleRestriction,
            UserSphere
        ])
    ],
    providers: [UsersService, AuthService, JWTAuthStrategy],
    controllers: [AuthController]
})

export class AuthModule {

}

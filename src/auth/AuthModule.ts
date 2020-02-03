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

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '60s'},
        }),
        TypeOrmModule.forFeature([User, UserRepository])
    ],
    providers: [UsersService, AuthService, JWTAuthStrategy],
    controllers: [AuthController]
})

export class AuthModule {

}

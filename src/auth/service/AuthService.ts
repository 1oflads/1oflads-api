import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UsersService} from "../../users/service/UsersService";
import * as bcrypt from "bcrypt";
import {UserLoginRequest} from "../payload/UserLoginRequest";
import {JwtService} from '@nestjs/jwt';
import {UserLoginResponse} from "../payload/UserLoginResponse";
import {UserStrippedDTO} from "../payload/UserStrippedDTO";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {
    }

    async validateUser(username: string, password: string): Promise<UserStrippedDTO> {
        const user = await this.usersService.findByUsername(username);
        if (user && bcrypt.compareSync(password, user.password)) {
            return new UserStrippedDTO(user.id, user.username, user.role?.name, user.role?.theme, user.isAdmin);
        }

        return null;
    }

    async login(userModel: UserLoginRequest) {
        const user = await this.validateUser(userModel.username, userModel.password);
        if (user === null) {
            throw new UnauthorizedException();
        }

        return new UserLoginResponse(this.jwtService.sign({sub: user.id, username: user.username, role: user?.role, theme: user?.roleTheme, isAdmin: user.isAdmin}));
    }
}


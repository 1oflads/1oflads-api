import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {UserLoginRequest} from "../payload/UserLoginRequest";
import {AuthService} from "../service/AuthService";
import {UserLoginResponse} from "../payload/UserLoginResponse";
import {Public} from "../decorator/AuthDecorator";

@Controller("/token")
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Public()
    @Post()
    async login(@Body() userModel: UserLoginRequest): Promise<UserLoginResponse> {
        return this.authService.login(userModel);
    }
}

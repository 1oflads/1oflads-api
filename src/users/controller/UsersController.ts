import {Body, Controller, Get, Post, Req} from "@nestjs/common";
import {UserRegisterRequest} from "../payload/UserRegisterRequest";
import {UsersService} from "../service/UsersService";
import {User} from "../entity/User";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {AuthPrincipal, Public} from "../../auth/decorator/AuthDecorator";

@Controller("/users")
export class UsersController {

    constructor(
        private readonly userService: UsersService
    ) {
    }

    @Public()
    @Post()
    async register(@Body() userModel: UserRegisterRequest): Promise<User> {
        return this.userService.register(userModel);
    }

    @Get("/me")
    async profile(@AuthPrincipal() user): Promise<UserStrippedDTO> {
        return user;
    }
}

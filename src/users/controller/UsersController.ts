import {Body, Controller, Get, Post} from "@nestjs/common";
import {UserRegisterRequest} from "../payload/UserRegisterRequest";
import {UsersService} from "../service/UsersService";
import {User} from "../entity/User";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {AuthPrincipal, Public} from "../../auth/decorator/AuthDecorator";
import {UserProfileViewModel} from "../payload/UserProfileViewModel";

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
    async profile(@AuthPrincipal() principal: UserStrippedDTO): Promise<UserProfileViewModel> {
        const user = await this.userService.find(principal.id);
        return new UserProfileViewModel(
            user.username,
            user.name,
            user.description,
            user.role.name
        );
    }
}

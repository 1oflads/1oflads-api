import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {UserRegisterRequest} from "../payload/UserRegisterRequest";
import {UsersService} from "../service/UsersService";
import {User} from "../entity/User";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {AuthPrincipal, Public} from "../../auth/decorator/AuthDecorator";
import {UserProfileViewModel} from "../payload/UserProfileViewModel";
import {UserProfileEditRequest} from "../payload/UserProfileEditRequest";
import {FileInterceptor} from "@nestjs/platform-express";
import {RoleInfoViewModel} from "../payload/RoleInfoViewModel";
import {UserRateViewModel} from "../entity/UserRateViewModel";
import {GroupCreateRequest} from "../entity/GroupCreateRequest";

@Controller("/users")
export class UsersController {

    constructor(
        private readonly userService: UsersService,
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
            user.avatarUrl,
            user.description,
            user.points,
            new RoleInfoViewModel(user.role?.id, user.role?.name, user.role?.theme)
        );
    }

    @Patch("/me")
    @UseInterceptors(FileInterceptor("avatar"))
    async edit(
        @AuthPrincipal() principal: UserStrippedDTO,
        @Body() model: UserProfileEditRequest,
        @UploadedFile() avatar
    ): Promise<UserProfileViewModel> {
        return this.userService.edit(principal.id, model, avatar);
    }

    @Get("/rating")
    async rating(): Promise<UserRateViewModel[]> {
        return this.userService.findAllSorted();
    }

    @Post("/group")
    async group(request: GroupCreateRequest): Promise<GroupCreateRequest> {
        return this.userService.createGroup(request);
    }

}



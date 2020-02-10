import {
    Body,
    Controller,
    Get,
    Param,
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
import {RoleInfoViewModel} from "../payload/RoleInfoViewModel";
import {UserRateViewModel} from "../entity/UserRateViewModel";
import {GroupCreateRequest} from "../payload/GroupCreateRequest";
import {ImageUpload} from "../../core/decorator/CoreDecorator";
import {GroupPreviewModel} from "../payload/GroupPreviewModel";
import {SpherePreviewModel} from "../payload/SpherePreviewModel";

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
        const spheres = await this.userService.getSpheresByUserId(principal.id);
        return new UserProfileViewModel(
            user.username,
            user.name,
            user.avatarUrl,
            user.description,
            user.points,
            new RoleInfoViewModel(user.role?.id, user.role?.name, user.role?.theme),
            (await user.groups).map(g => new GroupPreviewModel(g.id, g.name)),
            spheres.map(s => new SpherePreviewModel(s.id, s.name))
        );
    }

    @Patch("/me")
    @UseInterceptors(ImageUpload("avatar"))
    async edit(
        @AuthPrincipal() principal: UserStrippedDTO,
        @Body() model: UserProfileEditRequest,
        @UploadedFile() avatar
    ): Promise<UserProfileViewModel> {
        return this.userService.edit(principal.id, model, avatar);
    }

    @Public()
    @Get("/rating")
    async rating(): Promise<UserRateViewModel[]> {
        return this.userService.findAllSorted();
    }

    @Get('/:id/groups')
    async userGroups(@Param() id: number): Promise<GroupPreviewModel[]> {
        return this.userService.findUserGroups(id);
    }

}



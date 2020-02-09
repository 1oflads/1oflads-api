import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {UsersService} from "../service/UsersService";
import {GroupCreateRequest} from "../payload/GroupCreateRequest";
import {GroupPreviewModel} from "../payload/GroupPreviewModel";
import {GroupViewModel} from "../payload/GroupViewModel";
import {Public} from "../../auth/decorator/AuthDecorator";

@Controller("/groups")
export class GroupsController {
    constructor(
        private readonly userService: UsersService,
    ) {
    }

    @Post()
    async group(@Body() request: GroupCreateRequest): Promise<GroupCreateRequest> {
        return this.userService.createGroup(request);
    }

    @Get()
    @Public()
    async groups(): Promise<GroupPreviewModel[]> {
        return this.userService.findGroups();
    }

    @Get("/:id")
    @Public()
    async groupDetails(@Param() groupId: number): Promise<GroupViewModel> {
        return this.userService.findGroupDetails(groupId)
    }
}

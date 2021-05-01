import {Body, Controller, Get, Param, Patch, Post, Query} from "@nestjs/common";
import {UsersService} from "../service/UsersService";
import {GroupCreateRequest} from "../payload/GroupCreateRequest";
import {GroupPreviewModel} from "../payload/GroupPreviewModel";
import {GroupViewModel} from "../payload/GroupViewModel";
import {AuthPrincipal, Public} from "../../auth/decorator/AuthDecorator";
import {CalendarEventCreateRequest} from "../payload/CalendarEventCreateRequest";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {EventInfoViewModel} from "../payload/EventInfoViewModel";

@Controller("/groups")
export class GroupsController {
    constructor(
        private readonly userService: UsersService,
    ) {
    }

    @Post()
    async create(@Body() request: GroupCreateRequest): Promise<GroupCreateRequest> {
        return this.userService.createGroup(request);
    }

    @Get()
    @Public()
    async all(): Promise<GroupPreviewModel[]> {
        return this.userService.findGroups();
    }

    @Get("/:id")
    @Public()
    async details(@Param("id") groupId: number): Promise<GroupViewModel> {
        return this.userService.findGroupDetails(groupId)
    }

    @Get("/:id/calendar")
    async getCalendar(
        @Param("id") id: number,
        @AuthPrincipal() user: UserStrippedDTO,
        @Query("from") from: Date,
        @Query("to") to: Date
    ): Promise<EventInfoViewModel[]> {
        return this.userService.getGroupAppointments(
            id,
            user.id,
            from,
            to
        );
    }

    @Patch("/:id/calendar")
    async createAppointment(
        @Param("id") id: number,
        @Body() request: CalendarEventCreateRequest,
        @AuthPrincipal() user: UserStrippedDTO
    ): Promise<EventInfoViewModel> {
        return this.userService.createGroupAppointment(
            id,
            user.id,
            request
        );
    }

}

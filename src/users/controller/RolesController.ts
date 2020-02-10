import {Controller, Get} from "@nestjs/common";
import {UsersService} from "../service/UsersService";
import {AuthPrincipal} from "../../auth/decorator/AuthDecorator";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {RoleInfoViewModel} from "../payload/RoleInfoViewModel";

@Controller("/roles")
export class RolesController {
    constructor(
        private readonly userService: UsersService
    ) {
    }

    @Get()
    async all(@AuthPrincipal() principal: UserStrippedDTO): Promise<RoleInfoViewModel[]> {
        return (await this.userService.isUserEligibleToChangeRole(principal.id))
            ? this.userService.findAllRoles()
            : [];
    }
}

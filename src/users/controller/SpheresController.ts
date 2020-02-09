import {Controller, Get} from "@nestjs/common";
import {UsersService} from "../service/UsersService";
import {SpherePreviewModel} from "../payload/SpherePreviewModel";

@Controller("/spheres")
export class SpheresController {
    constructor(
        private usersService: UsersService
    ) {

    }

    @Get()
    public spheres(): Promise<SpherePreviewModel[]> {
        return this.usersService.findSpheres();
    }
}

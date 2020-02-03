import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {UsersController} from "./controller/UsersController";
import {User} from "./entity/User";
import {UsersService} from "./service/UsersService";
import {UserRepository} from "./repository/UserRepository";
import {Group} from "./entity/Group";
import {Role} from "./entity/Role";

@Module({
    imports: [TypeOrmModule.forFeature([User, Group, Role, UserRepository])],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UserModule {

}

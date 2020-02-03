import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {UsersController} from "./controller/UsersController";
import {User} from "./entity/User";
import {UsersService} from "./service/UsersService";
import {UserRepository} from "./repository/UserRepository";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRepository])],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UserModule {

}

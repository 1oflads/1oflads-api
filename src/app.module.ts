import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {UserModule} from "./users/UserModule";
import {User} from "./users/entity/User";
import {AuthModule} from "./auth/AuthModule";
import {Group} from "./users/entity/Group";
import {Rankable} from "./users/entity/Rankable";
import {Role} from "./users/entity/Role";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'dbname12',
            entities: [User, Group, Rankable, Role],
            synchronize: true,
        }),
        UserModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor(private readonly connection: Connection) {
    }
}

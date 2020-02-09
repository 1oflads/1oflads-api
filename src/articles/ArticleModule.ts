import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import FileConfig from "../config/FileConfig";
import {ArticlesController} from "./controller/ArticlesController";
import {ArticlesService} from "./service/ArticlesService";
import {Article} from "./entity/Article";
import {UserRepository} from "../users/repository/UserRepository";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [FileConfig]
        }),
        TypeOrmModule.forFeature([
            Article,
            UserRepository
        ])],
    providers: [ArticlesService],
    controllers: [ArticlesController]
})

export class ArticleModule {

}

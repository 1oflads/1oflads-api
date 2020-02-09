import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile
} from "@nestjs/common";
import {ArticlesService} from "../service/ArticlesService";
import {AuthPrincipal, Public} from "../../auth/decorator/AuthDecorator";
import {ArticleRequest} from "../payload/ArticleRequest";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {ArticleEditRequest} from "../payload/ArticleEditRequest";

@Controller("/articles")
export class ArticlesController {
    constructor(
        private articlesService: ArticlesService
    ) {
    }

    @Get()
    @Public()
    public findArticles() {
        return this.articlesService.findAllArticlePreviews();
    }

    @Get("/projects")
    @Public()
    public findProjects() {
        return this.articlesService.findAllProjectPreviews();
    }

    @Get("/projects/:id")
    @Public()
    public findArticlesByProject(@Param("id") id: number) {
        return this.articlesService.findArticlePreviewsByProject(id);
    }

    @Get("/:id")
    @Public()
    public findArticle(@Param("id") id: number) {
        return this.articlesService.findArticle(id);
    }

    @Post()
    public create(
        @AuthPrincipal() principal: UserStrippedDTO,
        @Body() request: ArticleRequest,
        @UploadedFile() image
    ) {
        return this.articlesService.create(principal, request, image);
    }

    @Patch("/:id")
    public edit(
        @Param("id") id: number,
        @Body() request: ArticleEditRequest,
        @UploadedFile() image
    ) {
        return this.articlesService.edit(id, request, image);
    }
}

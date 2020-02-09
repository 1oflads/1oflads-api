import {InjectRepository} from "@nestjs/typeorm";
import {Article} from "../entity/Article";
import {Repository} from "typeorm";
import {ArticleViewModel} from "../payload/ArticleViewModel";
import {ArticleAuthorViewModel} from "../payload/ArticleAuthorViewModel";
import {UserStrippedDTO} from "../../auth/payload/UserStrippedDTO";
import {ArticleRequest} from "../payload/ArticleRequest";
import * as fs from "fs";
import {Inject} from "@nestjs/common";
import FileConfig from "../../config/FileConfig";
import {ConfigType} from "@nestjs/config";
import {ArticlePreviewModel} from "../payload/ArticlePreviewModel";
import {ProjectViewModel} from "../payload/ProjectViewModel";
import {User} from "../../users/entity/User";
import {UserRepository} from "../../users/repository/UserRepository";
import {ArticleEditRequest} from "../payload/ArticleEditRequest";

export class ArticlesService {
    constructor (
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @Inject(FileConfig.KEY) private readonly fileConfig: ConfigType<typeof FileConfig>,
        @InjectRepository(User) private readonly userRepository: UserRepository
    ) {

    }

    async saveFile(file) {
        const now = new Date();

        fs.writeFileSync(
            this.fileConfig.destination + now.getTime() + file.originalname,
            file.buffer
        );

        return this.fileConfig.staticRoot + encodeURIComponent(now.getTime() + file.originalname);
    }

    async findAllArticlePreviews(): Promise<ArticlePreviewModel[]> {
        return (await this.articleRepository.createQueryBuilder("a")
            .where("a.id NOT IN (SELECT distinct b.articlesId FROM article b WHERE b.articlesId IS NOT NULL)")
            .getMany())
            .map(p => new ArticlePreviewModel(p.id, p.title, p.imageUrl));
    }

    async findArticlePreviewsByProject(projectId: number): Promise<ArticlePreviewModel[]> {
        return (await this.articleRepository.find({
            where: {
                project: {
                    id: projectId
                }
            }
        })).map(a => new ArticlePreviewModel(a.id, a.title, a.imageUrl));
    }

    async findAllProjectPreviews(): Promise<ArticlePreviewModel[]> {
        return (await this.articleRepository.createQueryBuilder("a")
            .innerJoin("a.project", "p")
            .groupBy("p.id")
            .getMany())
            .map(p => new ArticlePreviewModel(p.id, p.title, p.resume, p.imageUrl));
    }

    async findArticle(id: number): Promise<ArticleViewModel> {
        let article = await this.articleRepository.findOne(id);

        return new ArticleViewModel(
            new ArticleAuthorViewModel((await article.author).id, (await article.author).name),
            new ProjectViewModel((await article.project).id, (await article.project).title),
            article.title,
            article.content,
            article.imageUrl,
            article.datePublished
        );
    }

    async create(principal: UserStrippedDTO, request: ArticleRequest, image: File): Promise<ArticleViewModel> {
        let article = new Article();

        article.author = this.userRepository.findOne(principal.id);
        article.project = this.articleRepository.findOne(request.projectId);
        article.title = request.title;
        article.content = request.content;
        article.datePublished = new Date();

        if (image !== undefined) {
            article.imageUrl = await this.saveFile(image);
        }

        await this.articleRepository.save(article);

        return new ArticleViewModel(
            new ArticleAuthorViewModel(principal.id, principal.username),
            new ProjectViewModel((await article.project).id, (await article.project).title),
            article.title,
            article.content,
            article.imageUrl,
            article.datePublished
        );
    }

    async edit(id: number, request: ArticleEditRequest, image): Promise<ArticleViewModel> {
        let article = await this.articleRepository.findOne(id);

        article.title = request.title;
        article.content = request.content;

        if (image !== undefined) {
            article.imageUrl = await this.saveFile(image);
        }

        return new ArticleViewModel(
            new ArticleAuthorViewModel((await article.author).id, (await article.author).username),
            new ProjectViewModel((await article.project).id, (await article.project).title),
            article.title,
            article.content,
            article.imageUrl,
            article.datePublished
        );
    }
}

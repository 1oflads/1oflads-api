import {
    Column,
    Entity, JoinTable,
    ManyToMany,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "../../users/entity/User";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => User)
    public author: Promise<User>;

    @Column()
    public title: string;

    @Column({
        type: "longtext"
    })
    public content: string;

    @Column()
    public resume: string;

    @Column()
    public imageUrl: string;

    @Column()
    public datePublished: Date = new Date();

    @OneToMany(type => Article, article => article.articles)
    public project: Promise<Article>;

    @ManyToOne(type => Article)
    public articles: Article[];
}


import {ArticleAuthorViewModel} from "./ArticleAuthorViewModel";
import {ProjectViewModel} from "./ProjectViewModel";

export class ArticleViewModel {
    constructor(
        public author: ArticleAuthorViewModel = new ArticleAuthorViewModel(),
        public project: ProjectViewModel = new ProjectViewModel(),
        public title: string = '',
        public content: string = '',
        public imageUrl: string = 'https://images-na.ssl-images-amazon.com/images/I/51-TrKw%2BYtL._AC_SX355_.jpg',
        public datePublished: Date = null
    ) {

    }
}

import {RoleTheme} from "../entity/RoleTheme";

export class RoleInfoViewModel {
    constructor(
        public id: number = 0,
        public name: string = '',
        public theme: RoleTheme
    ) {

    }
}

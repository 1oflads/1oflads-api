import {RoleTheme} from "../../users/entity/RoleTheme";

export class UserStrippedDTO {
    constructor(
        public id: number = 0,
        public username: string = '',
        public role: string = '',
        public roleTheme: RoleTheme = null,
        public isAdmin: boolean = false
    ) {
    }
}

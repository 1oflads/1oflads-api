import {RoleTheme} from "../../users/entity/RoleTheme";

export class JWTPayload {
    constructor(
        public sub: number = 0,
        public username: string = '',
        public role = '',
        public theme: RoleTheme = null
    ) {
    }
}

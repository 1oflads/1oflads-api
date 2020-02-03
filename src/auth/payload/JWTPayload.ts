export class JWTPayload {
    constructor(
        public sub: number = 0,
        public username: string = ''
    ) {
    }
}

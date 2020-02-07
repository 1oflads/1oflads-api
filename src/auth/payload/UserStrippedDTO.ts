export class UserStrippedDTO {
    constructor(
        public id: number = 0,
        public username: string = '',
        public isAdmin: boolean = false
    ) {
    }
}

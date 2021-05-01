export class GroupCreateRequest {
    constructor(
        public id: number = 0,
        public name: string = '',
        public userIds: number[] = []
    ) {

    }
}

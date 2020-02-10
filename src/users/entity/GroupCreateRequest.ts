export class GroupCreateRequest {
    constructor(
        public name: string = '',
        public userIds: number[] = []
    ) {

    }
}

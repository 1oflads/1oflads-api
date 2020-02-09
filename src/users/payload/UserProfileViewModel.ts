import {RoleInfoViewModel} from "./RoleInfoViewModel";
import {SpherePreviewModel} from "./SpherePreviewModel";
import {GroupPreviewModel} from "./GroupPreviewModel";

export class UserProfileViewModel {
    constructor(
        public username: string,
        public name: string,
        public avatarUrl: string,
        public description: string,
        public points: number = 0,
        public role: RoleInfoViewModel,
        public groups: GroupPreviewModel[] = [],
        public spheres: SpherePreviewModel[] = []
    ) {
    }
}

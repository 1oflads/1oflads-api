import {RoleInfoViewModel} from "./RoleInfoViewModel";
import {SpherePreviewModel} from "./SpherePreviewModel";

export class UserProfileViewModel {
    constructor(
        public username: string,
        public name: string,
        public avatarUrl: string,
        public description: string,
        public points: number = 0,
        public role: RoleInfoViewModel,
        public spheres: SpherePreviewModel[] = []
    ) {
    }
}

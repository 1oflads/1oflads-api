import {Column, JoinTable, ManyToMany} from "typeorm";
import {User} from "../entity/User";
import {IsNotEmpty} from "class-validator";

export class GroupEditRequest {
    @IsNotEmpty()
    public name: string;

    public description: string;

    public backgroundColor: string;

    public innerBackgroundColor: string;

    public fontColor: string;

    public userIds: number[]
}

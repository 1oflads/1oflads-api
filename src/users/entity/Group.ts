import {ChildEntity, Column, JoinTable, ManyToMany, OneToMany} from "typeorm";
import {Rankable} from "./Rankable";
import {GroupChallengePoll} from "../../challenge/entity/GroupChallengePoll";
import {User} from "./User";

@ChildEntity()
export class Group extends Rankable {

    @Column()
    public name: string;

    @ManyToMany(type => User)
    @JoinTable()
    public users: User[];
}

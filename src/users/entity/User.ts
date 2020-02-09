import {ChildEntity, Column, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {Rankable} from "./Rankable";
import {GroupChallengePoll} from "../../challenge/entity/GroupChallengePoll";
import {Group} from "./Group";
import {UserRoleHistory} from "./UserRoleHistory";
import {Role} from "./Role";
import {Sphere} from "./Sphere";

@ChildEntity()
export class User extends Rankable {
    @Column()
    public name: string;

    @Column()
    public username: string;

    @Column()
    public password: string;

    @Column()
    isAdmin: boolean = false;

    @OneToMany(type => GroupChallengePoll, poll => poll.user)
    public polls: GroupChallengePoll[];

    @ManyToMany(type => Group, group => group.users)
    public groups: Group[];

    @ManyToMany(type => Sphere, sphere => sphere.users)
    public spheres: Sphere[];

    @OneToMany(type => UserRoleHistory, uhr => uhr.user)
    public roleHistory: UserRoleHistory[];

    @ManyToOne(type => Role, role => role.participants, {
        eager: true
    })
    public role: Role;

    @Column()
    public description: string;

    @Column()
    public avatarUrl: string;
}

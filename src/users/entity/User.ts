import {
    ChildEntity,
    Column,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from "typeorm";
import {Rankable} from "./Rankable";
import {GroupChallengePoll} from "../../challenge/entity/GroupChallengePoll";
import {Group} from "./Group";
import {UserRoleHistory} from "./UserRoleHistory";
import {Role} from "./Role";
import {Sphere} from "./Sphere";
import {GroupCalendar} from "./GroupCalendar";

@ChildEntity()
export class User extends Rankable {
    @Column()
    public name: string;

    @Column()
    public username: string;

    @Column()
    public password: string;

    @Column()
    public isAdmin: boolean = false;

    @OneToMany(type => GroupChallengePoll, poll => poll.user)
    public polls: Promise<GroupChallengePoll[]>;

    @ManyToMany(type => Group, group => group.users)
    @JoinTable({name: "user_groups"})
    public groups: Promise<Group[]>;

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

    @OneToMany(type => GroupCalendar, calendar => calendar.createdBy)
    public createdGroupCalendarSlots: Promise<GroupCalendar[]>;

    @Column({unique: true})
    public userId: number;
}

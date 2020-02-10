import {
    ChildEntity,
    Column,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from "typeorm";
import {Rankable} from "./Rankable";
import {User} from "./User";
import {Sphere} from "./Sphere";
import {GroupCalendar} from "./GroupCalendar";

@ChildEntity()
export class Group extends Rankable {

    @Column()
    public name: string;

    @Column()
    public avatarUrl: string;

    @Column()
    public description: string;

    @Column()
    public backgroundColor: string;

    @Column()
    public backgroundUrl: string;

    @Column()
    innerBackgroundColor: string;

    @Column()
    fontColor: string;

    @ManyToMany(type => User, user => user.groups)
    public users: Promise<User[]>;

    @Column()
    public sphereId: number;

    @OneToMany(type => GroupCalendar, calendar => calendar.group)
    public calendar: Promise<GroupCalendar[]>;

    @Column({unique: true})
    public groupId: number;
}

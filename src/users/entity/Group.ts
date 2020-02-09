import {
    ChildEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany, ManyToOne,
    OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import {Rankable} from "./Rankable";
import {GroupChallengePoll} from "../../challenge/entity/GroupChallengePoll";
import {User} from "./User";
import {Sphere} from "./Sphere";

@Entity()
export class Group extends Rankable {
    @PrimaryGeneratedColumn()
    public id: number;

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

    @ManyToMany(type => User)
    public users: Promise<User[]>;

    @ManyToOne(type => Sphere)
    @JoinTable()
    public sphere: Sphere;
}

import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Group} from "./Group";
import {EventType} from "./EventType";
import {User} from "./User";

@Entity()
export class GroupCalendar {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public from: Date;

    @Column()
    public to: Date;

    @ManyToOne(type => Group)
    public group: Promise<Group>;

    @Column()
    public eventType: EventType;

    @ManyToOne(type => User)
    public createdBy: Promise<User>;
}

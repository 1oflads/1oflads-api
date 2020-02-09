import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "./Role";
import {EventType} from "./EventType";

@Entity()
export class GroupRoleRestriction {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public eventType: EventType;

    @ManyToOne(type => Role)
    public role: Promise<Role>;

}

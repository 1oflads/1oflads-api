import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Rankable} from "./Rankable";
import {UserRoleHistory} from "./UserRoleHistory";
import {User} from "./User";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany(type => UserRoleHistory, uhr => uhr.role)
    public roleHistory: UserRoleHistory[];

    @OneToMany(type => User, user => user.role)
    public participants: User[];
}


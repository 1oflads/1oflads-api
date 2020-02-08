import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Rankable} from "./Rankable";
import {UserRoleHistory} from "./UserRoleHistory";
import {User} from "./User";
import {RoleTheme} from "./RoleTheme";
import {GroupRoleRestriction} from "./GroupRoleRestriction";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToOne(type => RoleTheme, roleTheme => roleTheme.role, {eager: true})
    public theme: RoleTheme;

    @OneToMany(type => UserRoleHistory, uhr => uhr.role)
    public roleHistory: UserRoleHistory[];

    @OneToMany(type => User, user => user.role)
    public participants: User[];

    @OneToMany(type => GroupRoleRestriction, restriction => restriction.role)
    public groupRestrictions: Promise<GroupRoleRestriction[]>;
}


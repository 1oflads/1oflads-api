import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "./Role";
import {User} from "./User";

@Entity()
export class UserRoleHistory {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => User, user => user.roleHistory)
    public user: User;

    @ManyToOne(type => Role, role => role.roleHistory)
    public role: Role;

    @Column()
    public points: number;

    @Column()
    public selectedOn: Date;

    @Column({nullable: true})
    public finishedOn: Date;
}

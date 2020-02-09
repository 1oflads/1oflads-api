import {
    Column,
    Entity, JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {PrimaryGeneratedColumnType} from "typeorm/driver/types/ColumnTypes";
import {User} from "./User";
import {Group} from "./Group";

@Entity()
export class Sphere {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @ManyToMany(type => User, user => user.spheres)
    @JoinTable()
    public users: User[];

    @OneToMany(type => Group, group => group.sphere)
    public groups: Group[];
}

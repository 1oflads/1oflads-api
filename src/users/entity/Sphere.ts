import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {Rankable} from "./Rankable";
import {UserSphere} from "./UserSphere";

@Entity()
export class Sphere {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @OneToMany(type => UserSphere, userSphere => userSphere.sphere)
    public users: Promise<UserSphere[]>;


}

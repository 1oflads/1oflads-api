import {Sphere} from "./Sphere";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserSphere {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public userId: number;

    @ManyToOne(type => Sphere, sphere => sphere.users)
    public sphere: Promise<Sphere>;
}

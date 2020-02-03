import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Rankable} from "./Rankable";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @ManyToMany(type => Rankable, rankable => rankable.roles)
    public participants: Rankable[];
}




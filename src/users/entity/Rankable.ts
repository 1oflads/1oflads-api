import {Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, TableInheritance} from "typeorm";
import {Role} from "./Role";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Rankable {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToMany(type => Role)
    @JoinTable()
    public roles: Role[];

}

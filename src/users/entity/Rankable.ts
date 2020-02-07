import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, TableInheritance} from "typeorm";
import {Role} from "./Role";
import {ChallengeApplication} from "../../challenge/entity/ChallengeApplication";


@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Rankable {

    @PrimaryGeneratedColumn()
    public id: number;

    @OneToMany(type => ChallengeApplication, application => application.doer)
    public challengeApplications: ChallengeApplication[];

    @Column()
    public points: number;

}

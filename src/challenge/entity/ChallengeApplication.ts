import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Challenge} from "./Challenge";
import {Rankable} from "../../users/entity/Rankable";
import {ValidationStatus} from "./ValidationStatus";

@Entity()
export class ChallengeApplication {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => Rankable, rankable => rankable.challengeApplications, {eager: true})
    public doer: Rankable;

    @ManyToOne(type => Challenge, challenge => challenge.challengeApplications, {eager: true})
    public challenge: Challenge;

    @Column()
    public completedOn: Date;

    @Column()
    public proofDescription: string;

    @Column()
    public proofUrl: string;

    @Column()
    public validationStatus: ValidationStatus;

    @Column()
    public validationDescription: string;
}

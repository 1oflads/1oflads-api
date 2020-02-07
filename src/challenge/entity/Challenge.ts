import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ChallengeApplication, ValidationStatus} from "./ChallengeApplication";
import {GroupChallengePoll} from "./GroupChallengePoll";

@Entity()
export class Challenge {

    @PrimaryGeneratedColumn()
    public id: Number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    public points: number;

    @Column()
    public startsOn: Date;

    @Column()
    public endsOn: Date;

    @Column()
    public validationStatus: ValidationStatus;

    @OneToMany(type => ChallengeApplication, application => application.challenge)
    public challengeApplications: ChallengeApplication[];

    @OneToMany(type => GroupChallengePoll, poll => poll.challenge)
    public polls: GroupChallengePoll[];
}

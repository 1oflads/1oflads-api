import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ChallengeApplication} from "./ChallengeApplication";
import {GroupChallengePoll} from "./GroupChallengePoll";
import {ValidationStatus} from "./ValidationStatus";
import {ChallengeType} from "./ChallengeType";
import {GroupApplicationCandidate} from "./GroupApplicationCandidate";

@Entity()
export class Challenge {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    public challengeType: ChallengeType;

    @Column()
    public points: number;

    @Column({nullable: true})
    public startsOn: Date;

    @Column({nullable: true})
    public endsOn: Date;

    @Column()
    public validationStatus: ValidationStatus;

    @OneToMany(type => ChallengeApplication, application => application.challenge)
    public challengeApplications: ChallengeApplication[];

    @OneToMany(type => GroupApplicationCandidate, gac => gac.challenge)
    public groupApplicationCandidates: Promise<GroupApplicationCandidate>;
}

import {Group} from "../../users/entity/Group";
import {Challenge} from "./Challenge";
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {GroupChallengePoll} from "./GroupChallengePoll";

@Entity()
export class GroupApplicationCandidate {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public groupId: number;

    @ManyToOne(type => Challenge, challenge => challenge.groupApplicationCandidates)
    public challenge: Promise<Challenge>;

    @Column()
    public proofDescription: string;

    @Column()
    public proofUrl: string;

    @OneToMany(type => GroupChallengePoll, poll => poll.applicationCandidate)
    public polls: Promise<GroupChallengePoll[]>;
}

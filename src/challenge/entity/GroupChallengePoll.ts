import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entity/User";
import {GroupApplicationCandidate} from "./GroupApplicationCandidate";

@Entity()
export class GroupChallengePoll {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => GroupApplicationCandidate, gac => gac.polls)
    public applicationCandidate: Promise<GroupApplicationCandidate>;

    @ManyToOne(type => User)
    public user: Promise<User>;

    @Column()
    public isAccepted: boolean;
}


import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Challenge} from "./Challenge";
import {User} from "../../users/entity/User";

@Entity()
export class GroupChallengePoll {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public groupId: number;

    @ManyToOne(type => Challenge, challenge => challenge.polls)
    public challenge: Challenge;

    @ManyToOne(type => User, user => user.polls)
    public user: User;

    @Column()
    public isAccepted: boolean;
}

import {EntityRepository, Repository} from "typeorm";
import {Challenge} from "../entity/Challenge";
import {ChallengeApplication, ValidationStatus} from "../entity/ChallengeApplication";
import {GroupChallengePoll} from "../entity/GroupChallengePoll";

@EntityRepository(GroupChallengePoll)
export class PollRepository extends Repository<GroupChallengePoll> {

    async findByChallengeAndGroup(groupId: number, challengeId: number): Promise<GroupChallengePoll[]> {
        return this.find(
            {
                where: {
                    group: {
                        id: groupId
                    },
                    challenge: {
                        id: challengeId
                    }
                }
            }
        );
    }
}

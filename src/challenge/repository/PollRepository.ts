import {EntityRepository, Repository} from "typeorm";
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

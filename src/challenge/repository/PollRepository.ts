import {EntityRepository, Repository} from "typeorm";
import {GroupChallengePoll} from "../entity/GroupChallengePoll";
import {GroupApplicationCandidate} from "../entity/GroupApplicationCandidate";

@EntityRepository(GroupChallengePoll)
export class PollRepository extends Repository<GroupChallengePoll> {

    async findByCandidate(candidate: Promise<GroupApplicationCandidate>): Promise<GroupChallengePoll[]> {
        return this.find(
            {
                where: {
                    applicationCandidate: candidate
                }
            }
        );
    }
}

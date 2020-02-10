import {EntityRepository, Repository} from "typeorm";
import {Challenge} from "../entity/Challenge";
import {ValidationStatus} from "../entity/ValidationStatus";

@EntityRepository(Challenge)
export class ChallengeRepository extends Repository<Challenge> {

    async findAllAccepted(): Promise<Challenge[]> {
        return this.find({validationStatus: ValidationStatus.ACCEPTED});
    }

    async findAllWaiting(): Promise<Challenge[]> {
        return this.find({validationStatus: ValidationStatus.PENDING});
    }

    async findAllRejected(): Promise<Challenge[]> {
        return this.find({validationStatus: ValidationStatus.REJECTED});
    }
}

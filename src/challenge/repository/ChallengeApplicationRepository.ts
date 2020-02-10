import {EntityRepository, Repository} from "typeorm";
import {ChallengeApplication} from "../entity/ChallengeApplication";
import {ValidationStatus} from "../entity/ValidationStatus";
import {Challenge} from "../entity/Challenge";

@EntityRepository(ChallengeApplication)
export class ChallengeApplicationRepository extends Repository<ChallengeApplication> {

    async findChallengesByUser(userId: number, validationStatus: ValidationStatus): Promise<Challenge[]> {
        return (await this.findByUser(userId, validationStatus)).map(application => application.challenge);
    }

    async findByUser(userId: number, validationStatus: ValidationStatus): Promise<ChallengeApplication[]> {
        return this.find({
            where: {
                user: {
                    id: userId
                },
                validationStatus: validationStatus
            }
        })
    }


    async findByUserAndChallenge(userId: number, challengeId: number, validationStatus: ValidationStatus): Promise<ChallengeApplication[]> {
        return this.find({
            where: {
                user: {
                    id: userId,
                },
                challenge: {
                    id: challengeId
                },
                validationStatus: validationStatus
            }
        })
    }


    async findWaiting(): Promise<ChallengeApplication[]> {
        return this.find(
            {
                where: {
                    validationStatus: ValidationStatus.PENDING
                }
            }
        )
    }


}

import {EntityRepository, Repository} from "typeorm";
import {Challenge} from "../entity/Challenge";
import {ChallengeApplication, ValidationStatus} from "../entity/ChallengeApplication";

@EntityRepository(Challenge)
export class ChallengeRepository extends Repository<Challenge> {

    constructor(
        @EntityRepository(ChallengeApplication) private readonly challengeApplicationRepository: Repository<ChallengeApplication>
    ) {
        super();
    }

    async findAllAccepted(): Promise<Challenge[]> {
        return this.find({validationStatus: ValidationStatus.ACCEPTED});
    }

    async findAllWaiting(): Promise<Challenge[]> {
        return this.find({validationStatus: ValidationStatus.PENDING});
    }

    async findAllRejected(): Promise<Challenge[]> {
        return this.find({validationStatus: ValidationStatus.REJECTED});
    }

    async findByUser(userId: number, validationStatus: ValidationStatus): Promise<Challenge[]> {
        return (await this.findApplicationsByUser(userId, validationStatus)).map(application => application.challenge);
    }

    async findApplicationsByUser(userId: number, validationStatus: ValidationStatus): Promise<ChallengeApplication[]> {
        return this.challengeApplicationRepository.find({
            where: {
                user: {
                    id: userId
                },
                validationStatus: validationStatus
            }
        })
    }

    async findApplicationsByUserAndChallenge(userId: number, challengeId: number, validationStatus: ValidationStatus): Promise<ChallengeApplication[]> {
        return this.challengeApplicationRepository.find({
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

    async saveApplication(application: ChallengeApplication) {
        return this.challengeApplicationRepository.save(application);
    }

    async findApplicationById(applicationId: number): Promise<ChallengeApplication> {
        return this.challengeApplicationRepository.findOne(applicationId);
    }

    async findWaitingApplications(): Promise<ChallengeApplication[]> {
        return this.challengeApplicationRepository.find(
            {
                where: {
                    validationStatus: ValidationStatus.PENDING
                }
            }
        )
    }
}

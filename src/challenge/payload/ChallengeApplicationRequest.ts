import {IsNotEmpty} from "class-validator";

export class ChallengeApplicationRequest {
    @IsNotEmpty()
    public proofDescription: string;

    public groupId: number;
}

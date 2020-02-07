import {IsNotEmpty} from "class-validator";

export class ChallengeApplicationRequest {

    @IsNotEmpty()
    public proofDescription: string;

    @IsNotEmpty()
    public proofUrl: string;

    public groupId: number;
}

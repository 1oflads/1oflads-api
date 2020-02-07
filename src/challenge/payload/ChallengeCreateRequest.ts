import {IsNotEmpty} from "class-validator";

export class ChallengeCreateRequest {

    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public description: string;

    @IsNotEmpty()
    public points: number;

    public startsOn: Date;

    public endsOn: Date;
}

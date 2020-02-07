import {IsNotEmpty} from "class-validator";

export class RejectApplicationRequest {

    @IsNotEmpty()
    public description: string;
}

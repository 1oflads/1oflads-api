import {IsNotEmpty} from "class-validator";
import {UploadedFile, UploadedFiles} from "@nestjs/common";

export class UserProfileEditRequest {
    @IsNotEmpty()
    public name: string = '';

    public password: string = '';

    public confirm: string = '';

    public description: string = '';

    public sphereIds: string = '';

    public roleId: number = 0;

}

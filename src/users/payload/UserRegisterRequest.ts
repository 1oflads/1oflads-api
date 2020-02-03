import {IsEmail, IsNotEmpty} from "class-validator";

export class UserRegisterRequest {

    @IsEmail()
    public username: string;

    @IsNotEmpty()
    public password: string;
}

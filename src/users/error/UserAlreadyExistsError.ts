import {ConflictException} from "@nestjs/common";

export class UserAlreadyExistsError extends ConflictException {

}

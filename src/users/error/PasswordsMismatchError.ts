import {ConflictException} from "@nestjs/common";

export class PasswordsMismatchError extends ConflictException {

}

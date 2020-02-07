import {ForbiddenException} from "@nestjs/common";

export class NotAnOwnerError extends ForbiddenException {

}

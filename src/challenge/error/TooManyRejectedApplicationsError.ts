import {ConflictException} from "@nestjs/common";

export class TooManyRejectedApplicationsError extends ConflictException {

}

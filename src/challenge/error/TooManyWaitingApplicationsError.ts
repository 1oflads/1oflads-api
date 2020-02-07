import {ConflictException} from "@nestjs/common";

export class TooManyWaitingApplicationsError extends ConflictException {

}

import {ConflictException} from "@nestjs/common";

export class AlreadyAcceptedChallengeError extends ConflictException {

}

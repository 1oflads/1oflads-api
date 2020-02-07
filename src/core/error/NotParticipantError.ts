import {ForbiddenException} from "@nestjs/common";

export class NotParticipantError extends ForbiddenException {

}

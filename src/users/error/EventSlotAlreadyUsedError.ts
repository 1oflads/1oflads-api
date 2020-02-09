import {ConflictException} from "@nestjs/common";

export class EventSlotAlreadyUsedError extends ConflictException {

}

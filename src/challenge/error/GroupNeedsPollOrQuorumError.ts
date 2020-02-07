import {ConflictException} from "@nestjs/common";

export class GroupNeedsPollOrQuorumError extends ConflictException {

}

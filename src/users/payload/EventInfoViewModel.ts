import {EventType} from "../entity/EventType";

export class EventInfoViewModel {
    constructor(
        public from: Date,
        public to: Date,
        public eventType: EventType
    ) {
    }
}

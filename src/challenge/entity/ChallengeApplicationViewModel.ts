import {Challenge} from './Challenge';

export class ChallengeApplicationViewModel {
  constructor(
    public id: number,
    public challenge: Challenge,
    public completedOn: Date,
    public proofDescription: string,
    public proofUrl: string,
  ) {

  }
}

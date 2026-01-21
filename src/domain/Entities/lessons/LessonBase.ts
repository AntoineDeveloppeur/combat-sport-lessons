import { Sport } from "../../type"
import { DurationTooHigh } from "../../errors/durationTooHigh"
import { DurationTooLow } from "../../errors/DurationTooLow"

export class LessonBase {
  constructor(
    public readonly objective: string,
    public readonly duration: number,
    public readonly sport: Sport,
    public readonly coreInstructions: string
  ) {
    this.validBusinessRules()
  }
  validBusinessRules() {
    const maxDuration = 180 // minutes
    if (this.duration > maxDuration)
      throw new DurationTooHigh(this.duration, maxDuration)
    const minDuration = 60 // minutes
    if (this.duration < minDuration)
      throw new DurationTooLow(this.duration, minDuration)
  }
}

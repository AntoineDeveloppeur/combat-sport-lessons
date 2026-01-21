import { LessonBase } from "./LessonBase"
import { Sport } from "../../type"

export class LessonCoreOnly extends LessonBase {
  public readonly type = "lesson" as const
  constructor(
    objective: string,
    duration: number,
    sport: Sport,
    coreInstructions: string
  ) {
    super(objective, duration, sport, coreInstructions)
  }
}

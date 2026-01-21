import { LessonBase } from "./LessonBase"
import { Sport } from "../../type"

export class LessonWithWarmUp extends LessonBase {
  public readonly type = "lessonWithWarmUp" as const
  constructor(
    objective: string,
    duration: number,
    sport: Sport,
    coreInstructions: string,
    public readonly warmUpInstructions: string
  ) {
    super(objective, duration, sport, coreInstructions)
  }
}

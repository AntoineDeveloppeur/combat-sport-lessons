import { LessonBase } from "./LessonBase"
import { Sport } from "../../type"

export class LessonFull extends LessonBase {
  public readonly type = "lessonFull" as const

  constructor(
    objective: string,
    duration: number,
    sport: Sport,
    coreInstructions: string,
    public readonly warmUpInstructions: string,
    public readonly coolDownInstructions: string
  ) {
    super(objective, duration, sport, coreInstructions)
  }
}

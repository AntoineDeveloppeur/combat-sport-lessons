import { LessonBase } from "./LessonBase"
import { Sport } from "../../type"

export class LessonWithCoolDown extends LessonBase {
  public readonly type = "lessonWithCoolDown" as const
  constructor(
    objective: string,
    duration: number,
    sport: Sport,
    coreInstructions: string,
    public readonly coolDownInstructions: string
  ) {
    super(objective, duration, sport, coreInstructions)
  }
}

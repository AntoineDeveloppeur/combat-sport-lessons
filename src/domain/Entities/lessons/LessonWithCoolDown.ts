import { LessonBase } from "./LessonBase"

export class LessonWithCoolDown implements LessonBase {
  readonly type = "lessonWithCoolDown" as const
  constructor(
    public objective: string,
    public duration: number,
    public sport: string,
    public coreInstructions: string,
    public coolDownInstructions: string
  ) {}
}

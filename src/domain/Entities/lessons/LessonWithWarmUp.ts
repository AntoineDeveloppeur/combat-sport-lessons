import { LessonBase } from "./LessonBase"

export class LessonWithWarmUp implements LessonBase {
  readonly type = "lessonWithWarmUp" as const
  constructor(
    public objective: string,
    public duration: number,
    public sport: string,
    public coreInstructions: string,
    public warmUpInstructions: string
  ) {}
}

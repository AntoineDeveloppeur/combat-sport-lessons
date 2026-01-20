import { LessonBase } from "./LessonBase"

export class LessonCoreOnly implements LessonBase {
  readonly type = "lesson" as const
  constructor(
    public duration: number,
    public sport: string,
    public coreInstructions: string
  ) {}
}

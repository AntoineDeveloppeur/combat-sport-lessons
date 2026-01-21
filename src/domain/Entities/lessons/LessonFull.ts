import { LessonBase } from "./LessonBase"

export class LessonFull implements LessonBase {
  readonly type = "fullLesson" as const
  constructor(
    public objective: string,
    public duration: number,
    public sport: string,
    public coreInstructions: string,
    public warmUpInstructions: string,
    public coolDownInstructions: string
  ) {}
}

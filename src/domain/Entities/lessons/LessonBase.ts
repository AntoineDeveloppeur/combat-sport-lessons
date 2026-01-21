type LessonType =
  | "lesson"
  | "lessonWithWarmUp"
  | "lessonWithCoolDown"
  | "fullLesson"

export interface LessonBase {
  readonly type: LessonType
  objective: string
  duration: number
  sport: string
  coreInstructions: string
}

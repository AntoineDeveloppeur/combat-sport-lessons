type LessonType =
  | "lesson"
  | "lessonWithWarmUp"
  | "lessonWithCoolDown"
  | "fullLesson"

export interface LessonBase {
  readonly type: LessonType
  duration: number
  sport: string
  coreInstructions: string
}

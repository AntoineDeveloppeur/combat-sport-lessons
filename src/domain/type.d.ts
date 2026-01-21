import { LessonCoreOnly } from "./Entities/lessons/LessonCoreOnly"
import { LessonWithCoolDown } from "./Entities/lessons/LessonWithCoolDown"
import { LessonWithWarmUp } from "./Entities/lessons/LessonWithWarmUp"
import { LessonFull } from "./Entities/lessons/LessonFull"

export type Sport = "Karaté" | "Boxe" | "Boxe Française" | "Boxe Thaïlandaise"

export type LessonType =
  | LessonCoreOnly
  | LessonWithWarmUp
  | LessonWithCoolDown
  | LessonFull

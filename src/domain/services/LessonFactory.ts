import { LessonCoreOnly } from "../Entities/lessons/LessonCoreOnly"
import { LessonWithCoolDown } from "../Entities/lessons/LessonWithCoolDown"
import { LessonWithWarmUp } from "../Entities/lessons/LessonWithWarmUp"
import { LessonFull } from "../Entities/lessons/LessonFull"

type LessonType =
  | LessonCoreOnly
  | LessonWithWarmUp
  | LessonWithCoolDown
  | LessonFull

export class LessonFactory {
  static create(lessonData: LessonType): LessonType {
    switch (lessonData.type) {
      case "lesson":
        return new LessonCoreOnly(
          lessonData.duration,
          lessonData.sport,
          lessonData.coreInstructions
        )
      case "lessonWithWarmUp":
        return new LessonWithWarmUp(
          lessonData.duration,
          lessonData.sport,
          lessonData.coreInstructions,
          lessonData.warmUpInstructions
        )
      case "lessonWithCoolDown":
        return new LessonWithCoolDown(
          lessonData.duration,
          lessonData.sport,
          lessonData.coreInstructions,
          lessonData.coolDownInstructions
        )
      case "fullLesson":
        return new LessonFull(
          lessonData.duration,
          lessonData.sport,
          lessonData.coreInstructions,
          lessonData.warmUpInstructions,
          lessonData.coolDownInstructions
        )
      default:
        const _exhaustive: never = lessonData
        throw new Error(`Unhandled lesson type: ${_exhaustive}`)
    }
  }
}

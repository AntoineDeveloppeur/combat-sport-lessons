import { LessonCoreOnly } from "../Entities/lessons/LessonCoreOnly"
import { LessonWithCoolDown } from "../Entities/lessons/LessonWithCoolDown"
import { LessonWithWarmUp } from "../Entities/lessons/LessonWithWarmUp"
import { LessonFull } from "../Entities/lessons/LessonFull"
import { LessonType } from "../type"

export class LessonFactory {
  static create(lessonData: LessonType): LessonType {
    const { objective, duration, sport, coreInstructions } = lessonData
    switch (lessonData.type) {
      case "lesson":
        return new LessonCoreOnly(objective, duration, sport, coreInstructions)
      case "lessonWithWarmUp":
        return new LessonWithWarmUp(
          objective,
          duration,
          sport,
          coreInstructions,
          lessonData.warmUpInstructions
        )
      case "lessonWithCoolDown":
        return new LessonWithCoolDown(
          objective,
          duration,
          sport,
          coreInstructions,
          lessonData.coolDownInstructions
        )
      case "lessonFull":
        return new LessonFull(
          objective,
          duration,
          sport,
          coreInstructions,
          lessonData.warmUpInstructions,
          lessonData.coolDownInstructions
        )
      default:
        const _exhaustive: never = lessonData
        throw new Error(`Unhandled lesson type: ${_exhaustive}`)
    }
  }
}

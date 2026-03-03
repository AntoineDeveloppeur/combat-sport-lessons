import { Lesson } from "../../domain/Entities/Lesson.js"
import { mockLesson } from "../../data/mockLesson.js"

export const dBtoEntityMapping = (
  lessonDB,
  warmUpInstructionsDB,
  bodyInstructionsDB,
  coolDownInstructionsDB,
): Lesson => {
  // récupérer toutes les instructions
  // les mettre dans l'ordre
  return mockLesson
}

import { Lesson } from "../Entities/Lesson"

export class LessonTransactionError extends Error {
  status: number = 500
  log: object
  constructor(lesson: Lesson, error: Error) {
    const publicMessage = "L'enregistrement de la leçon a échoué"
    const logMessage =
      "la transaction d'enregistrement de la lesson dans la base de donnée a rollback. Voici la lesson"
    super(publicMessage)
    this.log = { logMessage: logMessage, lesson: lesson, error: error }
  }
}

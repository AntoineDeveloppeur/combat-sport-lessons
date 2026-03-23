import { Lesson } from "../Entities/Lesson"

export class LessonTransactionError extends Error {
  status: number = 500
  cause: Error
  constructor(lesson: Lesson, error: Error) {
    super(
      `la transaction d'enregistrement de la lesson dans la base de donnée a rollback. Voici la lesson : ${lesson} `
    )
    this.cause = error
  }
}

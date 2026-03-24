export class LessonTransactionError extends Error {
  status = 500
  log
  constructor(lesson, error) {
    const publicMessage = "L'enregistrement de la leçon a échoué"
    const logMessage =
      "la transaction d'enregistrement de la lesson dans la base de donnée a rollback. Voici la lesson"
    super(publicMessage, { cause: error })
    this.log = { logMessage: logMessage, lesson: lesson }
  }
}

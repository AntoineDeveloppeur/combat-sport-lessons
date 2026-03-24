export class LessonIdNotFound extends Error {
  status = 404
  log
  constructor(id) {
    const publicMessage = "Leçon introuvable"
    const logMessage = `La leçon avec l'identifiant ${id} n'a pas été trouvée dans la base de données`
    super(publicMessage)
    this.log = { logMessage, lessonId: id }
  }
}

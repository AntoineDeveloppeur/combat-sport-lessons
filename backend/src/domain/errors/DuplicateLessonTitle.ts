export class DuplicateLessonTitle extends Error {
  status: number = 409
  log: { logMessage: string; title: string }
  constructor(title: string) {
    const publicMessage = "Une leçon avec ce titre existe déjà"
    const logMessage = `Tentative de création d'une leçon avec un titre déjà existant: ${title}`
    super(publicMessage)
    this.log = { logMessage, title }
  }
}

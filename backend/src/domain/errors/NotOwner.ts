export class NotOwner extends Error {
  status: number = 403
  log: { logMessage: string }
  constructor(userId: string, lessonId: string) {
    const publicMessage = "Vous n'êtes pas l'auteur de cette leçon"
    const logMessage = `l'utilisateur n'est pas l'auteur userId: ${userId}, lessonId: ${lessonId}`
    super(publicMessage)
    this.log = { logMessage }
  }
}

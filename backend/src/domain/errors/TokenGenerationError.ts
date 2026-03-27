export class TokenGenerationError extends Error {
  status: number = 500
  log: { logMessage: string; userId: string }
  constructor(userId: string, error: Error) {
    const publicMessage = "Erreur lors de la génération du token"
    const logMessage = `Erreur lors de la génération du toke npour cette utilisateur : ${userId}`
    super(publicMessage, { cause: error })
    this.log = { logMessage: logMessage, userId: userId }
  }
}

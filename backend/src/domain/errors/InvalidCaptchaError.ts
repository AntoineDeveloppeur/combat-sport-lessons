export class InvalidCaptchaError extends Error {
  status: number = 400
  log: { logMessage: string; score?: number }
  constructor(score?: number) {
    const publicMessage = "Échec de la vérification CAPTCHA"
    const logMessage =
      score !== undefined
        ? `CAPTCHA échoué avec un score de ${score}`
        : "Token CAPTCHA invalide ou expiré"
    super(publicMessage)
    this.log = { logMessage, score }
  }
}

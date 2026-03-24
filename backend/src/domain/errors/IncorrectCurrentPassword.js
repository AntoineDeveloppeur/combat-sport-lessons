export class IncorrectCurrentPassword extends Error {
  status = 401
  log
  constructor() {
    const publicMessage = "Le mot de passe actuel est incorrect"
    const logMessage =
      "Tentative de changement de mot de passe avec un ancien mot de passe incorrect"
    super(publicMessage)
    this.log = { logMessage }
  }
}

export class EmailAlreadyUsed extends Error {
  status = 409
  log
  constructor(email) {
    const publicMessage = "Cet email est déjà utilisé"
    const logMessage = `Tentative d'inscription avec un email déjà existant: ${email}`
    super(publicMessage)
    this.log = { logMessage, email }
  }
}

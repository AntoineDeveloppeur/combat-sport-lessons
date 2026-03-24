export class EmailAlreadyUsed extends Error {
  status: number = 409
  log: { logMessage: string; email: string }
  constructor(email: string) {
    const publicMessage = "Cet email est déjà utilisé"
    const logMessage = `Tentative d'inscription avec un email déjà existant: ${email}`
    super(publicMessage)
    this.log = { logMessage, email }
  }
}

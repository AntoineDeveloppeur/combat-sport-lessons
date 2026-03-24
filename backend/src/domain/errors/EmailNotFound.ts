export class EmailNotFound extends Error {
  status: number = 404
  log: { logMessage: string; email: string }
  constructor(email: string) {
    const publicMessage = "Aucun compte utilisateur trouvé avec cet email"
    const logMessage = `Email non trouvé dans la base de données: ${email}`
    super(publicMessage)
    this.log = { logMessage, email }
  }
}

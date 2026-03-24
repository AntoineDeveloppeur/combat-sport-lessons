export class EmailNotFound extends Error {
  status = 404
  log
  constructor(email) {
    const publicMessage = "Aucun compte utilisateur trouvé avec cet email"
    const logMessage = `Email non trouvé dans la base de données: ${email}`
    super(publicMessage)
    this.log = { logMessage, email }
  }
}

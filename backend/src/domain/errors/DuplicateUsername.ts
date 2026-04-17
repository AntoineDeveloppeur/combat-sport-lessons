export class DuplicateUsername extends Error {
  status: number = 409
  log: { logMessage: string; username: string }
  constructor(username: string) {
    const publicMessage = "Ce nom d'utilisateur est déjà utilisé"
    const logMessage = `Tentative d'inscription avec un nom d'utilisateur déjà existant: ${username}`
    super(publicMessage)
    this.log = { logMessage, username }
  }
}

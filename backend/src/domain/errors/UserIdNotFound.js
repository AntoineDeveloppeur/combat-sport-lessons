export class UserIdNotFound extends Error {
  status = 404
  log
  constructor(id) {
    const publicMessage = "Utilisateur introuvable"
    const logMessage = `L'utilisateur avec l'identifiant ${id} n'a pas été trouvé dans la base de données`
    super(publicMessage)
    this.log = { logMessage, id }
  }
}

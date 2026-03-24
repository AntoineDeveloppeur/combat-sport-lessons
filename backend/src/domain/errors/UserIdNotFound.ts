export class UserIdNotFound extends Error {
  status: number = 404
  log: { logMessage: string; id: string }
  constructor(id: string) {
    const publicMessage = "Utilisateur introuvable"
    const logMessage = `L'utilisateur avec l'identifiant ${id} n'a pas été trouvé dans la base de données`
    super(publicMessage)
    this.log = { logMessage, id }
  }
}

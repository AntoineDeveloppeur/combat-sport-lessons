export class IncorrectCurrentPassword extends Error {
  status: number = 401
  constructor() {
    super("l'ancien mot de passe donné est incorrect")
  }
}

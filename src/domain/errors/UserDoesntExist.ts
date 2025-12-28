export class UserDoesntExist extends Error {
  status: number = 400
  constructor(email: string) {
    super(`${email} doesn't have an account`)
    this.name = "userDoesntExist"
  }
}

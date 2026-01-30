export class EmailNotFound extends Error {
  status: number = 400
  constructor(email: string) {
    super(`${email} n'a pas de compte utilisateur`)
  }
}

export class EmailNotFound extends Error {
  status: number = 400
  constructor(email: string) {
    super(`${email} doesn't have an account`)
  }
}

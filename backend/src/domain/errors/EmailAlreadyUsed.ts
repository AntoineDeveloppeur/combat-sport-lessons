export class EmailAlreadyUsed extends Error {
  status: number = 400
  constructor(email: string) {
    super(`${email} est déjà utilisé`)
  }
}

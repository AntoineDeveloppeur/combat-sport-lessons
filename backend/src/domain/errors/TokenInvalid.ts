export class TokenInvalid extends Error {
  status: number = 401
  logMessage: string
  constructor(token: string, error: Error) {
    const publicMessage =
      "le token utilisé contient une erreur, veuillez vous reconnecter"
    super(publicMessage, {
      cause: error,
    })
    this.logMessage = `le token utilisé contient une erreur :${token.substring(0, 10)}`
  }
}

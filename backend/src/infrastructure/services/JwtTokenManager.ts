import jwt from "jsonwebtoken"
import { TokenManager } from "../../domain/services/TokenManager.js"

export class JwtTokenManager implements TokenManager {
  private secret: string
  private expiresIn: string | number

  constructor(secret: string, expiresIn: string | number = "24h") {
    this.secret = secret
    this.expiresIn = expiresIn
  }

  async generateToken(userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        { userId },
        this.secret,
        { expiresIn: this.expiresIn } as Record<string, unknown>,
        (error: unknown, token: unknown) => {
          if (error || !token) {
            reject(
              new Error("Erreur lors de la génération du token", {
                cause: error,
              }),
            )
          } else {
            resolve(token as string)
          }
        },
      )
    })
  }

  async verifyToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (error: unknown, decoded: unknown) => {
        if (error) {
          reject(new Error("Token invalide ou expiré"))
        } else {
          const payload = decoded as { userId: string }
          resolve(payload.userId)
        }
      })
    })
  }
}

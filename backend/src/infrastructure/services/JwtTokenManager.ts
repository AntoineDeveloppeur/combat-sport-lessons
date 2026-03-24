import jwt from "jsonwebtoken"
import { TokenManager } from "../../domain/services/TokenManager.js"

export class JwtTokenManager implements TokenManager {
  private secret: string
  private expiresIn: string

  constructor(secret: string, expiresIn: string = "24h") {
    this.secret = secret
    this.expiresIn = expiresIn
  }

  async generateToken(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { userId },
        this.secret,
        { expiresIn: this.expiresIn },
        (error: Error | null, token: string | undefined) => {
          if (error || !token) {
            reject(new Error("Erreur lors de la génération du token"))
          } else {
            resolve(token)
          }
        },
      )
    })
  }

  async verifyToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (error: Error | null, decoded: any) => {
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

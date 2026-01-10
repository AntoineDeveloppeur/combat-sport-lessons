import { PasswordHasher } from "../../domain/services/PasswordHasher.js"
import bcrypt from "bcrypt"

export class BcryptPasswordHasher implements PasswordHasher {
  private saltRounds: number = 10
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }
  async verify(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}

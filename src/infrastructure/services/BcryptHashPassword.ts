import { PasswordHasher } from "../../domain/services/PasswordHasher"
import bcrypt from "bcrypt"

export class BcryptPasswordHasher implements PasswordHasher {
  private saltRounds: number = 10
  hash(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds)
  }
  verify(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
  }
}

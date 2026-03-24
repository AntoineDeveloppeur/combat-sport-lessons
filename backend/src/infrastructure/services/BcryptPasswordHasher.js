import bcrypt from "bcrypt"
export class BcryptPasswordHasher {
  saltRounds = 10
  async hash(password) {
    return await bcrypt.hash(password, this.saltRounds)
  }
  async verify(password, hash) {
    return await bcrypt.compare(password, hash)
  }
}

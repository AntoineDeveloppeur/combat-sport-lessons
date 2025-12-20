import User from "../../domain/Entities/user.js"
import { UserRepository } from "../../domain/Repositories/userRepository.js"

export class PostSQLUserRepository implements UserRepository {
  async create(user: User) {
    setTimeout(() => {}, 1000)
    console.log("user created")
  }
  async isEmailAlreadyUsed(email: string): Promise<boolean> {
    console.log("email alreay used!")
    setTimeout(() => {}, 1000)
    return true
  }
}

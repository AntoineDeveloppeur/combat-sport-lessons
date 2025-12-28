import User from "../../domain/Entities/user.js"
import { UserRepository } from "../../domain/Repositories/userRepository.js"

export class PostSQLUserRepository implements UserRepository {
  async create(user: User) {
    setTimeout(() => {}, 1000)
    console.log("user created")
    console.log("user object", user)
  }
  async isEmailAlreadyUsed(email: string): Promise<boolean> {
    console.log("email already used!")
    setTimeout(() => {}, 1000)
    return true
  }
  async modifyPassword(id: string, hash: string): Promise<void> {
    console.log("password updated")
    setTimeout(() => {}, 1000)
  }
  async findUserId(email: string): Promise<string> {
    console.log("find user id")
    setTimeout(() => {}, 1000)
    return "id"
  }
}

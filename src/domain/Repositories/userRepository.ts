import User from "../Entities/user.js"

export interface UserRepository {
  create(user: User): Promise<void>
  isEmailAlreadyUsed(email: string): Promise<boolean>
}

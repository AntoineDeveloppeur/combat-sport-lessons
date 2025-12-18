import User from "../../domain/Entities/user"
import { UserRepository } from "../../domain/userRepository"

export class PostSQLUserRepository implements UserRepository {
  user: User
  constructor(user: User) {
    this.user = user
  }
  async save() {
    // save User in a PostSQL way
  }
}

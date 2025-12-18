import User from "./Entities/user"

export interface UserRepository {
  create(user: User): Promise<void>
}

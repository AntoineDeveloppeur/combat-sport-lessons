import User from "./Entities/user"

export interface UserRepository {
  save(user: User): Promise<void>
}

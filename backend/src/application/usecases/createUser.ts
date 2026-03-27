import { User } from "../../domain/Entities/User.js"
import { UserRepository } from "../../domain/repositories/userRepository.js"
import { EmailAlreadyUsed } from "../../domain/errors/EmailAlreadyUsed.js"
import { CreateUserRequest } from "../dto/CreateUserRequest.js"
import { IdGenerator } from "../../domain/services/IdGenerator.js"
import { PasswordHasher } from "../../domain/services/PasswordHasher.js"

export async function createUser(
  req: CreateUserRequest,
  userRepository: UserRepository,
  idGenerator: IdGenerator,
  passwordHasher: PasswordHasher
): Promise<string> {
  const emailAlreadyUsed = await userRepository.isEmailAlreadyUsed(req.email)
  if (emailAlreadyUsed) {
    throw new EmailAlreadyUsed(req.email)
  }
  const hash = await passwordHasher.hash(req.password)
  const userId = idGenerator.generate()
  const user = new User({
    id: userId,
    name: req.name,
    email: req.email,
    hash: hash,
    role: "user",
  })
  await userRepository.create(user)
  return userId
}

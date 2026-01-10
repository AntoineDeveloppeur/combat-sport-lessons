import { User } from "../../domain/entities/user.js"
import { UserRepository } from "../../domain/repositories/userRepository.js"
import { EmailAlreadyUsed } from "../../domain/errors/EmailAlreadyUsed.js"
import { CreateUserRequest } from "../dto/CreateUserRequest.js"
import { IdGenerator } from "../../domain/services/IdGenerator.js"
import { PasswordHasher } from "../../domain/services/PasswordHasher.js"

export async function createUser(
  createUserRequest: CreateUserRequest,
  userRepository: UserRepository,
  idGenerator: IdGenerator,
  passwordHasher: PasswordHasher
) {
  const emailAlreadyUsed = await userRepository.isEmailAlreadyUsed(
    createUserRequest.email
  )
  if (emailAlreadyUsed) {
    throw new EmailAlreadyUsed(createUserRequest.email)
  }
  const hash = await passwordHasher.hash(createUserRequest.password)
  const user = new User({
    id: idGenerator.generate(),
    name: createUserRequest.name,
    email: createUserRequest.email,
    hash: hash,
  })
  await userRepository.create(user)
}

import User from "../../domain/Entities/user.js"
import { UserRepository } from "../../domain/Repositories/userRepository.js"
import { EmailAlreadyUsed } from "../../domain/errors/EmailAlreadyUsed.js"
import { UserInfoFromFrontend } from "../dto/UserInfoFromFrontend.js"
import { IdGenerator } from "../../domain/services/IdGenerator.js"
import { PasswordHasher } from "../../domain/services/PasswordHasher.js"

export async function createUser(
  userInfoFromFrontend: UserInfoFromFrontend,
  userRepository: UserRepository,
  idGenerator: IdGenerator,
  passwordHasher: PasswordHasher
) {
  const emailAlreadyUsed = await userRepository.isEmailAlreadyUsed(
    userInfoFromFrontend.email
  )
  if (emailAlreadyUsed) {
    throw new EmailAlreadyUsed(userInfoFromFrontend.email)
  }
  const user = new User({
    id: idGenerator.generate(),
    name: userInfoFromFrontend.name,
    email: userInfoFromFrontend.email,
    hash: passwordHasher.hash(userInfoFromFrontend.password),
  })
  await userRepository.create(user)
}

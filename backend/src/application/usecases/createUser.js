import { User } from "../../domain/Entities/User.js"
import { EmailAlreadyUsed } from "../../domain/errors/EmailAlreadyUsed.js"
export async function createUser(
  createUserRequest,
  userRepository,
  idGenerator,
  passwordHasher
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

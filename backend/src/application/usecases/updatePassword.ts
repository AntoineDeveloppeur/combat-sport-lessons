import { UserRepository } from "../../domain/repositories/userRepository.js"
import { IncorrectCurrentPassword } from "../../domain/errors/IncorrectCurrentPassword.js"
import { PasswordHasher } from "../../domain/services/PasswordHasher.js"

export async function updatePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
  userRepository: UserRepository,
  passwordHasher: PasswordHasher
) {
  const userId = await userRepository.findUserId(email)

  // Verify if user gives the correct current password
  const storedHash = await userRepository.getHash(userId)
  const isCorrectCurrentPassword = await passwordHasher.verify(
    currentPassword,
    storedHash
  )
  if (!isCorrectCurrentPassword) throw new IncorrectCurrentPassword()

  const newHash = await passwordHasher.hash(newPassword)
  await userRepository.updatePassword(userId, newHash)
}

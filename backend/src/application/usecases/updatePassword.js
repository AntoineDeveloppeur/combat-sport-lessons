import { IncorrectCurrentPassword } from "../../domain/errors/IncorrectCurrentPassword.js"
export async function updatePassword(
  email,
  currentPassword,
  newPassword,
  userRepository,
  passwordHasher
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

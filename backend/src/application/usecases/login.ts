import { UserRepository } from "../../domain/repositories/userRepository"
import { PasswordHasher } from "../../domain/services/PasswordHasher"
import { TokenManager } from "../../domain/services/TokenManager"

export async function login(
  email: string,
  password: string,
  passwordHasher: PasswordHasher,
  userRepository: UserRepository,
  tokenManager: TokenManager
): Promise<{ token: string; userId: string }> {
  const userId = await userRepository.findUserId(email)
  const hash = await userRepository.getHash(userId)
  const isCredentialCorrect = await passwordHasher.verify(password, hash)

  if (!isCredentialCorrect) {
    throw new Error("Identifiants incorrects")
  }

  const token = await tokenManager.generateToken(userId)
  return { token, userId }
}

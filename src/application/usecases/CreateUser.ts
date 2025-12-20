import User from "../../domain/Entities/user.js"
import { UserRepository } from "../../domain/Repositories/userRepository.js"

type UserInfoFromFrontend = { name: string; email: string }
type CreateUserReturn = Promise<{
  error: string | null
}>

export async function createUser(
  userInfoFromFrontend: UserInfoFromFrontend,
  userRepository: UserRepository // je trouve ça étrange d'injecter une interface et non une instance de class
) {
  // Ajouter la logique si l'utilisateur existe déjà
  const emailAlreadyUsed = await userRepository.isEmailAlreadyUsed(
    userInfoFromFrontend.email
  )
  if (emailAlreadyUsed) {
    throw new EmailAlreadyUsed(userInfoFromFrontend)
  }

  const user = new User(userInfoFromFrontend)
  await userRepository.create(user)
}

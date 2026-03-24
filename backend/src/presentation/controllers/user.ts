import { createUser } from "../../application/usecases/createUser.js"
import { Response, Request } from "express"
import { PostSQLUserRepository } from "../../infrastructure/postSQL/PostSQLUserRepository.js"
import { EmailNotFound } from "../../domain/errors/EmailNotFound.js"
import { EmailAlreadyUsed } from "../../domain/errors/EmailAlreadyUsed.js"
import { IncorrectCurrentPassword } from "../../domain/errors/IncorrectCurrentPassword.js"
import { updatePassword } from "../../application/usecases/updatePassword.js"
import { CreateUserRequest } from "../../application/dto/CreateUserRequest.js"
import { RandomUUIDGenerator } from "../../infrastructure/services/RandomUUIDGenerator.js"
import { BcryptPasswordHasher } from "../../infrastructure/services/BcryptPasswordHasher.js"
import { pool } from "../../infrastructure/postSQL/postSQLPool.js"
import { UserIdNotFound } from "../../domain/errors/UserIdNotFound.js"
import { login } from "../../application/usecases/login.js"
import { JwtTokenManager } from "../../infrastructure/services/JwtTokenManager.js"

const postSQLUserRepository = new PostSQLUserRepository(pool)
const randomUUIDGenerator = new RandomUUIDGenerator()
const bcryptPasswordHasher = new BcryptPasswordHasher()
const jwtTokenManager = new JwtTokenManager(
  process.env.JWT_SECRET || "your-secret-key",
  "24h",
)

const userCtrl = {
  handleCreateUser: async (req: Request, res: Response) => {
    try {
      await createUser(
        req.body as unknown as CreateUserRequest, // Mettre en place un validateur de donnée
        postSQLUserRepository,
        randomUUIDGenerator,
        bcryptPasswordHasher,
      )
      return res.status(201).json({ message: "utilisateur créé avec succès" })
    } catch (error) {
      if (error instanceof EmailAlreadyUsed) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur interne au serveur" })
    }
  },
  handleUpdatePassword: async (req: Request, res: Response) => {
    try {
      await updatePassword(
        req.body.email,
        req.body.currentPassword,
        req.body.newPassword,
        postSQLUserRepository,
        bcryptPasswordHasher,
      )
      return res
        .status(200)
        .json({ message: "mot de passe modifié avec succès" })
    } catch (error) {
      if (error instanceof EmailNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof UserIdNotFound) {
        console.error(error.log)
        return res.status(error.status).json({
          error:
            "Erreur interne au serveur, veuillez contacter l'administrateur",
        })
      }
      if (error instanceof IncorrectCurrentPassword) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur interne du serveur" })
    }
  },
  handleLogin: async (req: Request, res: Response) => {
    try {
      const token = await login(
        req.body.email,
        req.body.password,
        bcryptPasswordHasher,
        postSQLUserRepository,
        jwtTokenManager,
      )
      return res.status(200).json({ token })
    } catch (error) {
      if (error instanceof EmailNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof UserIdNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      console.error(error)
      return res.status(401).json({ error: "Identifiants incorrects" })
    }
  },
}

export default userCtrl

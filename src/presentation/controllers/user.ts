import { createUser } from "../../application/useCases/CreateUser.js"
import { Response, Request } from "express"
import { PostSQLUserRepository } from "../../infrastructure/postSQL/PostSQLUserRepository.js"
import { EmailNotFound } from "../../domain/errors/EmailNotFound.js"
import { EmailAlreadyUsed } from "../../domain/errors/EmailAlreadyUsed.js"
import { IncorrectCurrentPassword } from "../../domain/errors/IncorrectCurrentPassword.js"
import updatePassword from "../../application/useCases/UpdatePassword.js"
import { UserInfoFromFrontend } from "../../../types/index.js"
import { RandomUUIDGenerator } from "../../infrastructure/services/RandomUUIDGenerator.js"
import { BcryptPasswordHasher } from "../../infrastructure/services/BcryptHashPassword.js"
import pool from "../../infrastructure/postSQL/postSQLPool.js"
import { UserIdNotFound } from "../../domain/errors/UserIdNotFound.js"

const userCtrl = {
  handleCreateUser: async (req: Request, res: Response) => {
    console.log("dans le controller")
    try {
      await createUser(
        req.body as unknown as UserInfoFromFrontend,
        new PostSQLUserRepository(pool),
        new RandomUUIDGenerator(),
        new BcryptPasswordHasher()
      )
      return res.status(201).json({ message: "utilisateur créé avec succès" })
    } catch (error) {
      if (error instanceof EmailAlreadyUsed) {
        return res.status(error.status).json({ error: error.message })
      }
      console.error(error)
      return res.status(500).json({ error: "Erreur interne au serveur" })
    }
  },
  handleUpdatePassword: async (req: Request, res: Response) => {
    try {
      await updatePassword(
        req.body.email,
        req.body.currentPassword,
        req.body.newPassword,
        new PostSQLUserRepository(pool),
        new BcryptPasswordHasher()
      )
      return res
        .status(200)
        .json({ message: "mot de passé modifié avec succès" })
    } catch (error) {
      if (error instanceof EmailNotFound) {
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof UserIdNotFound) {
        console.log(error)
        return res.status(error.status).json({
          error:
            "Erreur interne au serveur, veuillez contacter l'administrateur",
        })
      }
      if (error instanceof IncorrectCurrentPassword) {
        return res.status(error.status).json({ error: error.message })
      }
      console.error(error)
      res.status(500).json({ message: "Erreur interne du serveur" })
    }
  },
}

export default userCtrl

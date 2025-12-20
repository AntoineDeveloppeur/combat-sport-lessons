import { createUser } from "../../application/useCases/CreateUser.js"
import User from "../../domain/Entities/user.js"
import { Response, Request } from "express"
import { PostSQLUserRepository } from "../../infrastructure/repository/PostSQLUserRepository.js"

const user = {
  create: async (req: Request, res: Response) => {
    console.log("dans le controller")
    try {
      await createUser(req.body as unknown as User, new PostSQLUserRepository())
      return res.status(201).json({ message: "utilisateur créé avec succès" })
    } catch (error) {
      if (error instanceof EmailAlreadyUsed) {
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof StorageError) {
        return res.status(error.status).json({ error: error.message })
      }
      console.log(String(error))
      return res.status(500).json({ error: "Erreur interne au serveur" })
    }
  },
}

export default user

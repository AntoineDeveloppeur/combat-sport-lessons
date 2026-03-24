import { getLesson } from "../../application/usecases/lesson/getLesson.js"
import { getAllLessons } from "../../application/usecases/lesson/getAllLessons.js"
import { PostSQLLessonRepository } from "../../infrastructure/postSQL/PostSQLLessonRepository.js"
import { Response, Request } from "express"
import { pool } from "../../infrastructure/postSQL/postSQLPool.js"
import { postLesson } from "../../application/usecases/lesson/postLesson.js"
import { RandomUUIDGenerator } from "../../infrastructure/services/RandomUUIDGenerator.js"
import { LessonTransactionError } from "../../domain/errors/LessonTransactionError.js"
import { LessonIdNotFound } from "../../domain/errors/LessonIdNotFound.js"

const postSQLessonRepository = new PostSQLLessonRepository(pool)

export const lessonCtrl = {
  handleGet: async (req: Request, res: Response) => {
    // Vérifier que les données existe dans body sera fait plus tard
    const lessonId = req.params.id
    try {
      const lesson = await getLesson(lessonId, postSQLessonRepository)
      return res.status(200).json({ lesson })
    } catch (error) {
      console.log(error)
      if (error instanceof LessonIdNotFound) {
        return res.status(error.status).json({ error: error.message })
      }
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
  handleGetAll: async (__req: Request, res: Response) => {
    try {
      const lessons = await getAllLessons(postSQLessonRepository)
      return res.status(200).json({ lessons })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error })
    }
  },
  handlePost: async (req: Request, res: Response) => {
    try {
      await postLesson(
        req.body,
        postSQLessonRepository,
        new RandomUUIDGenerator()
      )
      return res.status(201).json({ message: "succès" })
    } catch (error) {
      if (error instanceof LessonTransactionError) {
        console.error(error.log)
        return res.status(error.status).json({ message: error.message })
      }
      console.error(error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
}

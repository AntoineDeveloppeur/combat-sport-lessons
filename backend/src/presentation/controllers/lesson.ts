import { getLesson } from "../../application/usecases/lesson/GetLesson.js"
import { getAllLessons } from "../../application/usecases/lesson/GetAllLessons.js"
import { PostSQLLessonRepository } from "../../infrastructure/postSQL/PostSQLLessonRepository.js"
import { Response, Request } from "express"
import { pool } from "../../infrastructure/postSQL/postSQLPool.js"

const postSQLessonRepository = new PostSQLLessonRepository(pool)

export const lessonCtrl = {
  handleGet: async (req: Request, res: Response) => {
    // Vérifier que les données existe dans body sera fait plus tard
    const lessonId = Number(req.params.id)
    try {
      const lesson = await getLesson(lessonId, postSQLessonRepository)
      return res.status(200).json({ lesson })
    } catch (error) {
      // différent cas d'erreur à écrire par la suite
      // exemple l'id n'existe pas
      console.log(error)
      return res.status(400).json({ error: "mauvaise requête" })
    }
  },
  handleGetAll: async (__req: Request, res: Response) => {
    try {
      const lessons = await getAllLessons(postSQLessonRepository)
      res.status(200).json({ lessons })
    } catch (error) {
      res.status(500).json({ error })
    }
  },
}

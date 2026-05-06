import { getLesson } from "../../application/usecases/lesson/getLesson.js"
import { getAllLessons } from "../../application/usecases/lesson/getAllLessons.js"
import { PostSQLLessonRepository } from "../../infrastructure/postSQL/PostSQLLessonRepository.js"
import { Response, Request } from "express"
import { getPool } from "../../infrastructure/postSQL/poolFactory.js"
import { postLesson } from "../../application/usecases/lesson/postLesson.js"
import { duplicateLesson } from "../../application/usecases/lesson/duplicateLesson.js"
import { deleteLesson } from "../../application/usecases/lesson/deleteLesson.js"
import { updateLesson } from "../../application/usecases/lesson/updateLesson.js"
import { RandomUUIDGenerator } from "../../infrastructure/services/RandomUUIDGenerator.js"
import { LessonTransactionError } from "../../domain/errors/LessonTransactionError.js"
import { DuplicateLessonTitle } from "../../domain/errors/DuplicateLessonTitle.js"
import { LessonIdNotFound } from "../../domain/errors/LessonIdNotFound.js"
import { JwtTokenManager } from "../../infrastructure/services/JwtTokenManager.js"
import { TokenInvalid } from "../../domain/errors/TokenInvalid.js"
import { toggleLessonVisibility } from "../../application/usecases/lesson/toggleLessonVisibility.js"
import { NotOwner } from "../../domain/errors/NotOwner.js"

const postSQLessonRepository = new PostSQLLessonRepository(getPool())
const jwtTokenManager = new JwtTokenManager(process.env.JWT_SECRET as string)

export const lessonCtrl = {
  handleGet: async (req: Request, res: Response) => {
    // Vérifier que les données existe dans body sera fait plus tard
    const lessonId = req.params.id
    try {
      const lesson = await getLesson(lessonId, postSQLessonRepository)
      return res.status(200).json({ lesson })
    } catch (error) {
      if (error instanceof LessonIdNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
  handleGetAll: async (__req: Request, res: Response) => {
    try {
      const lessons = await getAllLessons(postSQLessonRepository)
      return res.status(200).json({ lessons })
    } catch (error) {
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
  handlePost: async (req: Request, res: Response) => {
    try {
      const lessonId = await postLesson(
        req.body.lesson,
        req.body.token,
        jwtTokenManager,
        postSQLessonRepository,
        new RandomUUIDGenerator()
      )
      return res.status(201).json({ message: "succès", lessonId })
    } catch (error) {
      if (error instanceof LessonTransactionError) {
        console.error(error.log, error.cause)
        return res.status(error.status).json({ message: error.message })
      }
      if (error instanceof DuplicateLessonTitle) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof TokenInvalid) {
        console.error(error.logMessage, error.cause)
        return res.status(error.status).json({ message: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
  handleToggleVisibility: async (req: Request, res: Response) => {
    try {
      const lessonId = req.params.id
      const token = req.body.token
      const userId = await jwtTokenManager.getUserIdFromToken(token)

      await toggleLessonVisibility(lessonId, userId, postSQLessonRepository)
      return res.status(200).json({ message: "Visibilité mise à jour" })
    } catch (error) {
      if (error instanceof TokenInvalid) {
        console.error(error.logMessage, error.cause)
        return res.status(error.status).json({ message: error.message })
      }
      if (error instanceof LessonIdNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof NotOwner) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
  handleDuplicate: async (req: Request, res: Response) => {
    try {
      const lessonId = req.params.id
      const token = req.body.token

      const duplicatedLesson = await duplicateLesson(
        lessonId,
        token,
        jwtTokenManager,
        postSQLessonRepository,
        new RandomUUIDGenerator()
      )

      return res.status(201).json({ lesson: duplicatedLesson })
    } catch (error) {
      if (error instanceof LessonIdNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof NotOwner) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof TokenInvalid) {
        console.error(error.logMessage, error.cause)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof LessonTransactionError) {
        console.error(error.log, error.cause)
        return res.status(error.status).json({ error: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
  handleDelete: async (req: Request, res: Response) => {
    try {
      const lessonId = req.params.id
      const token = req.body.token

      await deleteLesson(
        lessonId,
        token,
        jwtTokenManager,
        postSQLessonRepository
      )

      return res.status(200).json({ message: "Leçon supprimée avec succès" })
    } catch (error) {
      if (error instanceof LessonIdNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof NotOwner) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof TokenInvalid) {
        console.error(error.logMessage, error.cause)
        return res.status(error.status).json({ error: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
  handleUpdate: async (req: Request, res: Response) => {
    try {
      const lessonId = req.params.id
      const lesson = req.body.lesson
      const token = req.body.token

      const updatedLesson = await updateLesson(
        lessonId,
        lesson,
        token,
        jwtTokenManager,
        postSQLessonRepository,
        new RandomUUIDGenerator()
      )

      return res.status(200).json({ lesson: updatedLesson })
    } catch (error) {
      if (error instanceof LessonIdNotFound) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof NotOwner) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof TokenInvalid) {
        console.error(error.logMessage, error.cause)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof DuplicateLessonTitle) {
        console.error(error.log)
        return res.status(error.status).json({ error: error.message })
      }
      if (error instanceof LessonTransactionError) {
        console.error(error.log, error.cause)
        return res.status(error.status).json({ error: error.message })
      }
      console.error("Unexpected Error:", error)
      return res.status(500).json({ error: "Erreur Interne du serveur" })
    }
  },
}

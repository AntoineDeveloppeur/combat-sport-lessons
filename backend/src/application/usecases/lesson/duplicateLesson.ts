import { Lesson } from "../../../domain/Entities/Lesson.js"
import { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import { IdGenerator } from "../../../domain/services/IdGenerator.js"
import { TokenManager } from "../../../domain/services/TokenManager.js"

export async function duplicateLesson(
  lessonId: string,
  token: string,
  tokenManager: TokenManager,
  lessonRepository: lessonRepository,
  idGenerator: IdGenerator
): Promise<Lesson> {
  const userId = await tokenManager.getUserIdFromToken(token)
  const duplicatedLesson = await lessonRepository.duplicate(
    lessonId,
    userId,
    idGenerator
  )
  return duplicatedLesson
}

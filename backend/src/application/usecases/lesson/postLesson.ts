import { Lesson } from "../../../domain/Entities/Lesson.js"
import { DuplicateLessonTitle } from "../../../domain/errors/DuplicateLessonTitle.js"
import { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import { IdGenerator } from "../../../domain/services/IdGenerator.js"
import { TokenManager } from "../../../domain/services/TokenManager.js"

export async function postLesson(
  lesson: Lesson,
  token: string,
  tokenManager: TokenManager,
  lessonRepository: lessonRepository,
  idGenerator: IdGenerator
): Promise<string> {
  const userId = await tokenManager.getUserIdFromToken(token)
  const titleAlreadyExists = await lessonRepository.titleExistsGlobally(
    lesson.title
  )
  if (titleAlreadyExists) {
    throw new DuplicateLessonTitle(lesson.title)
  }
  const lessonId = await lessonRepository.save(lesson, userId, idGenerator)
  return lessonId
}

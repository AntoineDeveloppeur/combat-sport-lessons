import { Lesson } from "../../../domain/Entities/Lesson.js"
import { DuplicateLessonTitle } from "../../../domain/errors/DuplicateLessonTitle.js"
import { NotOwner } from "../../../domain/errors/NotOwner.js"
import { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import { IdGenerator } from "../../../domain/services/IdGenerator.js"
import { TokenManager } from "../../../domain/services/TokenManager.js"

export async function updateLesson(
  lessonId: string,
  lesson: Lesson,
  token: string,
  tokenManager: TokenManager,
  lessonRepository: lessonRepository,
  idGenerator: IdGenerator
): Promise<Lesson> {
  const userId = await tokenManager.getUserIdFromToken(token)

  const existingLesson = await lessonRepository.get(lessonId)

  if (existingLesson.userId !== userId) {
    throw new NotOwner(userId, lessonId)
  }

  if (lesson.title !== existingLesson.title) {
    const titleExists = await lessonRepository.titleExistsGlobally(
      lesson.title,
      lessonId
    )
    if (titleExists) {
      throw new DuplicateLessonTitle(lesson.title)
    }
  }

  const updatedLesson = await lessonRepository.update(
    lessonId,
    lesson,
    idGenerator
  )
  return updatedLesson
}

import { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import { LessonIdNotFound } from "../../../domain/errors/LessonIdNotFound.js"
import { NotOwner } from "../../../domain/errors/NotOwner.js"

export async function toggleLessonVisibility(
  lessonId: string,
  userId: string,
  lessonRepository: lessonRepository
): Promise<void> {
  const lesson = await lessonRepository.get(lessonId)

  if (!lesson) {
    throw new LessonIdNotFound(lessonId)
  }

  if (lesson.userId !== userId) {
    throw new NotOwner(userId, lessonId)
  }

  const newVisibility = !lesson.isPublic
  await lessonRepository.updateVisibility(lessonId, newVisibility)
}

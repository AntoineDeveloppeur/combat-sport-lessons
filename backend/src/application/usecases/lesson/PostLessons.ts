import { Lesson } from "../../../domain/Entities/Lesson"
import { lessonRepository } from "../../../domain/repositories/lessonRepository"
import { IdGenerator } from "../../../domain/services/IdGenerator"

export async function postLesson(
  lesson: Lesson,
  lessonRepository: lessonRepository,
  idGenerator: IdGenerator
) {
  await lessonRepository.save(lesson, idGenerator)
}

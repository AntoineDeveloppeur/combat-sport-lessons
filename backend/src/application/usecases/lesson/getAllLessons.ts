import { lessonRepository } from "../../../domain/repositories/lessonRepository"

export function getAllLessons(lessonRepository: lessonRepository) {
  return lessonRepository.getAll()
}

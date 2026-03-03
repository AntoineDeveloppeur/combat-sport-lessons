import { lessonRepository } from "../../../domain/repositories/lessonRepository"

export async function getLesson(
  lessonId: number,
  lessonRepository: lessonRepository
) {
  // je regarde si la lesson existe ? ou je la récupère directement
  // C'est plus rapide de la récupérer directement
  // C'est le repo qui lancera une exception si l'id n'existe pas
  return await lessonRepository.get(lessonId)
}

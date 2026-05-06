import { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import { TokenManager } from "../../../domain/services/TokenManager.js"

export async function deleteLesson(
  lessonId: string,
  token: string,
  tokenManager: TokenManager,
  lessonRepository: lessonRepository
): Promise<void> {
  const userId = await tokenManager.getUserIdFromToken(token)
  await lessonRepository.delete(lessonId, userId)
}

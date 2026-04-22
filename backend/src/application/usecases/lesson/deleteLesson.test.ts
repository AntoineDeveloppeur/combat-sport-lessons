import { describe, test, expect, vi, beforeEach } from "vitest"
import { deleteLesson } from "./deleteLesson.js"
import { LessonIdNotFound } from "../../../domain/errors/LessonIdNotFound.js"
import { NotOwner } from "../../../domain/errors/NotOwner.js"
import { TokenInvalid } from "../../../domain/errors/TokenInvalid.js"
import type { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import type { TokenManager } from "../../../domain/services/TokenManager.js"

describe("deleteLesson use case", () => {
  let mockLessonRepository: Partial<lessonRepository>
  let mockTokenManager: Partial<TokenManager>

  beforeEach(() => {
    mockTokenManager = {
      getUserIdFromToken: vi.fn().mockResolvedValue("user-123"),
    }

    mockLessonRepository = {
      delete: vi.fn().mockResolvedValue(undefined),
    }
  })

  test("supprime une leçon avec succès", async () => {
    await deleteLesson(
      "lesson-123",
      "valid-token",
      mockTokenManager as TokenManager,
      mockLessonRepository as lessonRepository,
    )

    expect(mockLessonRepository.delete).toHaveBeenCalledWith(
      "lesson-123",
      "user-123",
    )
  })

  test("lance LessonIdNotFound si la leçon n'existe pas", async () => {
    mockLessonRepository.delete = vi
      .fn()
      .mockRejectedValue(new LessonIdNotFound("lesson-999"))

    await expect(
      deleteLesson(
        "lesson-999",
        "valid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
      ),
    ).rejects.toThrow(LessonIdNotFound)
  })

  test("lance NotOwner si l'utilisateur n'est pas propriétaire", async () => {
    mockLessonRepository.delete = vi
      .fn()
      .mockRejectedValue(new NotOwner("user-456", "lesson-123"))

    await expect(
      deleteLesson(
        "lesson-123",
        "valid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
      ),
    ).rejects.toThrow(NotOwner)
  })

  test("lance TokenInvalid si le token est invalide", async () => {
    mockTokenManager.getUserIdFromToken = vi
      .fn()
      .mockRejectedValue(new TokenInvalid("Invalid token", new Error()))

    await expect(
      deleteLesson(
        "lesson-123",
        "invalid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
      ),
    ).rejects.toThrow(TokenInvalid)
  })
})

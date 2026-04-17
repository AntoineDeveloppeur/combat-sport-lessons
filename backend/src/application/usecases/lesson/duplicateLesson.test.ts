import { describe, test, expect, vi, beforeEach } from "vitest"
import { duplicateLesson } from "./duplicateLesson.js"
import { LessonIdNotFound } from "../../../domain/errors/LessonIdNotFound.js"
import { TokenInvalid } from "../../../domain/errors/TokenInvalid.js"
import type { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import type { TokenManager } from "../../../domain/services/TokenManager.js"
import type { IdGenerator } from "../../../domain/services/IdGenerator.js"
import { Lesson } from "../../../domain/Entities/Lesson.js"

describe("duplicateLesson use case", () => {
  let mockLessonRepository: Partial<lessonRepository>
  let mockTokenManager: Partial<TokenManager>
  let mockIdGenerator: Partial<IdGenerator>

  const mockLesson = new Lesson(
    "lesson-123",
    "Ma leçon (copie)",
    "Karaté",
    "Apprendre les bases",
    [],
    [],
    [],
    new Date(),
    "user-123",
    false
  )

  beforeEach(() => {
    mockTokenManager = {
      getUserIdFromToken: vi.fn().mockResolvedValue("user-123"),
    }

    mockIdGenerator = {
      generate: vi.fn().mockReturnValue("lesson-456"),
    }

    mockLessonRepository = {
      duplicate: vi.fn().mockResolvedValue(mockLesson),
    }
  })

  test("duplique une leçon avec succès", async () => {
    const result = await duplicateLesson(
      "lesson-123",
      "valid-token",
      mockTokenManager as TokenManager,
      mockLessonRepository as lessonRepository,
      mockIdGenerator as IdGenerator
    )

    expect(result).toEqual(mockLesson)
    expect(mockLessonRepository.duplicate).toHaveBeenCalledWith(
      "lesson-123",
      "user-123",
      mockIdGenerator
    )
  })

  test("lance LessonIdNotFound si la leçon n'existe pas", async () => {
    mockLessonRepository.duplicate = vi
      .fn()
      .mockRejectedValue(new LessonIdNotFound("lesson-999"))

    await expect(
      duplicateLesson(
        "lesson-999",
        "valid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
        mockIdGenerator as IdGenerator
      )
    ).rejects.toThrow(LessonIdNotFound)
  })

  test("lance TokenInvalid si le token est invalide", async () => {
    mockTokenManager.getUserIdFromToken = vi
      .fn()
      .mockRejectedValue(new TokenInvalid("Invalid token", new Error()))

    await expect(
      duplicateLesson(
        "lesson-123",
        "invalid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
        mockIdGenerator as IdGenerator
      )
    ).rejects.toThrow(TokenInvalid)
  })
})

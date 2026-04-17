import { describe, test, expect, vi, beforeEach } from "vitest"
import { postLesson } from "./postLesson.js"
import { DuplicateLessonTitle } from "../../../domain/errors/DuplicateLessonTitle.js"
import type { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import type { TokenManager } from "../../../domain/services/TokenManager.js"
import type { IdGenerator } from "../../../domain/services/IdGenerator.js"
import { Lesson } from "../../../domain/Entities/Lesson.js"

describe("postLesson use case", () => {
  let mockLessonRepository: Partial<lessonRepository>
  let mockTokenManager: Partial<TokenManager>
  let mockIdGenerator: Partial<IdGenerator>

  beforeEach(() => {
    mockTokenManager = {
      getUserIdFromToken: vi.fn().mockResolvedValue("user-123"),
    }

    mockIdGenerator = {
      generate: vi.fn().mockReturnValue("lesson-456"),
    }

    mockLessonRepository = {
      save: vi.fn().mockResolvedValue("lesson-456"),
    }
  })

  test("crée une leçon avec succès", async () => {
    const lesson = new Lesson(
      "lesson-456",
      "Nouvelle leçon",
      "Karaté",
      "Apprendre les bases",
      [],
      [],
      [],
      new Date(),
      "user-123",
      false
    )

    const lessonId = await postLesson(
      lesson,
      "valid-token",
      mockTokenManager as TokenManager,
      mockLessonRepository as lessonRepository,
      mockIdGenerator as IdGenerator
    )

    expect(lessonId).toBe("lesson-456")
    expect(mockLessonRepository.save).toHaveBeenCalledWith(
      lesson,
      "user-123",
      mockIdGenerator
    )
  })

  test("lance une erreur si le titre existe déjà", async () => {
    const lesson = new Lesson(
      "lesson-789",
      "Titre existant",
      "Karaté",
      "Apprendre les bases",
      [],
      [],
      [],
      new Date(),
      "user-123",
      false
    )

    mockLessonRepository.save = vi
      .fn()
      .mockRejectedValue(new DuplicateLessonTitle("Titre existant"))

    await expect(
      postLesson(
        lesson,
        "valid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
        mockIdGenerator as IdGenerator
      )
    ).rejects.toThrow(DuplicateLessonTitle)
  })
})

import { describe, test, expect, vi, beforeEach } from "vitest"
import { updateLesson } from "./updateLesson.js"
import { LessonIdNotFound } from "../../../domain/errors/LessonIdNotFound.js"
import { NotOwner } from "../../../domain/errors/NotOwner.js"
import { TokenInvalid } from "../../../domain/errors/TokenInvalid.js"
import { DuplicateLessonTitle } from "../../../domain/errors/DuplicateLessonTitle.js"
import type { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import type { TokenManager } from "../../../domain/services/TokenManager.js"
import type { IdGenerator } from "../../../domain/services/IdGenerator.js"
import { Lesson } from "../../../domain/Entities/Lesson.js"

describe("updateLesson use case", () => {
  let mockLessonRepository: Partial<lessonRepository>
  let mockTokenManager: Partial<TokenManager>
  let mockIdGenerator: Partial<IdGenerator>
  let mockLesson: Lesson

  beforeEach(() => {
    mockTokenManager = {
      getUserIdFromToken: vi.fn().mockResolvedValue("user-123"),
    }

    mockLesson = new Lesson(
      "lesson-123",
      "Updated Title",
      "Boxe",
      "Updated objective",
      [],
      [{ text: "New exercise", min: 10, sec: 0, order: 1 }],
      [],
      new Date(),
      "user-123",
      false,
    )

    const existingLesson = new Lesson(
      "lesson-123",
      "Original Title",
      "Boxe",
      "Original objective",
      [],
      [],
      [],
      new Date(),
      "user-123",
      false,
    )

    mockLessonRepository = {
      get: vi.fn().mockResolvedValue(existingLesson),
      titleExistsGlobally: vi.fn().mockResolvedValue(false),
      update: vi.fn().mockResolvedValue(mockLesson),
    }

    mockIdGenerator = {
      generate: vi.fn().mockReturnValue("instruction-id"),
    }
  })

  test("met à jour une leçon avec succès", async () => {
    const result = await updateLesson(
      "lesson-123",
      mockLesson,
      "valid-token",
      mockTokenManager as TokenManager,
      mockLessonRepository as lessonRepository,
      mockIdGenerator as IdGenerator,
    )

    expect(mockLessonRepository.update).toHaveBeenCalledWith(
      "lesson-123",
      mockLesson,
      mockIdGenerator,
    )
    expect(result).toEqual(mockLesson)
  })

  test("lance LessonIdNotFound si la leçon n'existe pas", async () => {
    mockLessonRepository.update = vi
      .fn()
      .mockRejectedValue(new LessonIdNotFound("lesson-999"))

    await expect(
      updateLesson(
        "lesson-999",
        mockLesson,
        "valid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
        mockIdGenerator as IdGenerator,
      ),
    ).rejects.toThrow(LessonIdNotFound)
  })

  test("lance NotOwner si l'utilisateur n'est pas propriétaire", async () => {
    const lessonOwnedByOther = new Lesson(
      "lesson-123",
      "Original Title",
      "Boxe",
      "Original objective",
      [],
      [],
      [],
      new Date(),
      "user-456",
      false,
    )
    mockLessonRepository.get = vi.fn().mockResolvedValue(lessonOwnedByOther)

    await expect(
      updateLesson(
        "lesson-123",
        mockLesson,
        "valid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
        mockIdGenerator as IdGenerator,
      ),
    ).rejects.toThrow(NotOwner)
  })

  test("lance TokenInvalid si le token est invalide", async () => {
    mockTokenManager.getUserIdFromToken = vi
      .fn()
      .mockRejectedValue(new TokenInvalid("Invalid token", new Error()))

    await expect(
      updateLesson(
        "lesson-123",
        mockLesson,
        "invalid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
        mockIdGenerator as IdGenerator,
      ),
    ).rejects.toThrow(TokenInvalid)
  })

  test("lance DuplicateLessonTitle si le nouveau titre existe déjà", async () => {
    mockLessonRepository.titleExistsGlobally = vi.fn().mockResolvedValue(true)

    await expect(
      updateLesson(
        "lesson-123",
        mockLesson,
        "valid-token",
        mockTokenManager as TokenManager,
        mockLessonRepository as lessonRepository,
        mockIdGenerator as IdGenerator,
      ),
    ).rejects.toThrow(DuplicateLessonTitle)
  })
})

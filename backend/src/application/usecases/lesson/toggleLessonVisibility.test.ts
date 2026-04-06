import { describe, test, expect, vi } from "vitest"
import { toggleLessonVisibility } from "./toggleLessonVisibility.js"
import { LessonIdNotFound } from "../../../domain/errors/LessonIdNotFound.js"
import { NotOwner } from "../../../domain/errors/NotOwner.js"
import type { lessonRepository } from "../../../domain/repositories/lessonRepository.js"
import { Lesson } from "../../../domain/Entities/Lesson.js"

describe("toggleLessonVisibility use case", () => {
  test("toggle la visibilité de public à private", async () => {
    const mockLesson = new Lesson(
      "lesson-123",
      "Test Lesson",
      "Boxe",
      "Test",
      [],
      [],
      [],
      new Date(),
      "user-123",
      true,
    )

    const mockLessonRepository: Partial<lessonRepository> = {
      get: vi.fn().mockResolvedValue(mockLesson),
      updateVisibility: vi.fn().mockResolvedValue(undefined),
    }

    await toggleLessonVisibility(
      "lesson-123",
      "user-123",
      mockLessonRepository as lessonRepository,
    )

    expect(mockLessonRepository.updateVisibility).toHaveBeenCalledWith(
      "lesson-123",
      false,
    )
  })

  test("toggle la visibilité de private à public", async () => {
    const mockLesson = new Lesson(
      "lesson-456",
      "Test Lesson",
      "Karaté",
      "Test",
      [],
      [],
      [],
      new Date(),
      "user-456",
      false,
    )

    const mockLessonRepository: Partial<lessonRepository> = {
      get: vi.fn().mockResolvedValue(mockLesson),
      updateVisibility: vi.fn().mockResolvedValue(undefined),
    }

    await toggleLessonVisibility(
      "lesson-456",
      "user-456",
      mockLessonRepository as lessonRepository,
    )

    expect(mockLessonRepository.updateVisibility).toHaveBeenCalledWith(
      "lesson-456",
      true,
    )
  })

  test("lance LessonIdNotFound si lesson n'existe pas", async () => {
    const mockLessonRepository: Partial<lessonRepository> = {
      get: vi.fn().mockResolvedValue(null),
    }

    await expect(
      toggleLessonVisibility(
        "nonexistent-lesson",
        "user-123",
        mockLessonRepository as lessonRepository,
      ),
    ).rejects.toThrow(LessonIdNotFound)
  })

  test("lance NotOwner si userId ne correspond pas", async () => {
    const mockLesson = new Lesson(
      "lesson-123",
      "Test Lesson",
      "Judo",
      "Test",
      [],
      [],
      [],
      new Date(),
      "owner-123",
      true,
    )

    const mockLessonRepository: Partial<lessonRepository> = {
      get: vi.fn().mockResolvedValue(mockLesson),
    }

    await expect(
      toggleLessonVisibility(
        "lesson-123",
        "different-user-456",
        mockLessonRepository as lessonRepository,
      ),
    ).rejects.toThrow(NotOwner)
  })

  test("ne met pas à jour la visibilité si pas owner", async () => {
    const mockLesson = new Lesson(
      "lesson-123",
      "Test Lesson",
      "MMA",
      "Test",
      [],
      [],
      [],
      new Date(),
      "owner-123",
      true,
    )

    const mockLessonRepository: Partial<lessonRepository> = {
      get: vi.fn().mockResolvedValue(mockLesson),
      updateVisibility: vi.fn(),
    }

    try {
      await toggleLessonVisibility(
        "lesson-123",
        "different-user",
        mockLessonRepository as lessonRepository,
      )
    } catch (error) {
      // Expected error
    }

    expect(mockLessonRepository.updateVisibility).not.toHaveBeenCalled()
  })

  test("appelle lessonRepository.get avec lessonId", async () => {
    const mockLesson = new Lesson(
      "lesson-789",
      "Test",
      "Boxe",
      "Test",
      [],
      [],
      [],
      new Date(),
      "user-789",
      false,
    )

    const mockLessonRepository: Partial<lessonRepository> = {
      get: vi.fn().mockResolvedValue(mockLesson),
      updateVisibility: vi.fn(),
    }

    await toggleLessonVisibility(
      "lesson-789",
      "user-789",
      mockLessonRepository as lessonRepository,
    )

    expect(mockLessonRepository.get).toHaveBeenCalledWith("lesson-789")
  })
})

import { describe, it, expect } from "vitest"
import {
  addInstructions,
  dbtoEntityMappingGetAll,
} from "./dbtoEntityMappingGetAll"
import type { Sport } from "../../domain/type"

const createLessonRow = (
  lessonId: number,
  title: string,
  sport: Sport,
  userId: number,
  text: string,
  type: string,
  min: number,
  order: number
) => ({
  lesson_id: lessonId,
  title,
  sport,
  objective: "Test objective",
  created_at: new Date("2026-01-01"),
  user_id: userId,
  text,
  type,
  min,
  sec: 0,
  order,
})

describe("addInstructions", () => {
  it("should add first coolDown instruction to lesson", () => {
    const lesson = {
      lessonId: 1,
      userId: 1,
      title: "Boxe débutant",
      objective: "Apprendre les bases",
      creationDate: new Date("2026-01-01"),
      sport: "Boxe" as Sport,
    }

    const instructionRow = createLessonRow(
      1,
      "Boxe débutant",
      "Boxe" as Sport,
      1,
      "Étirements bras",
      "coolDown",
      3,
      1
    )

    const result = addInstructions(lesson, instructionRow)

    expect(result.coolDownInstructions).toEqual([
      { text: "Étirements bras", min: 3, sec: 0, order: 1 },
    ])
  })

  it("should append instruction to existing array", () => {
    const lesson = {
      lessonId: 1,
      userId: 1,
      title: "Boxe débutant",
      objective: "Apprendre les bases",
      creationDate: new Date("2026-01-01"),
      sport: "Boxe" as Sport,
      warmUpInstructions: [{ text: "Jumping jacks", min: 3, sec: 0, order: 1 }],
    }

    const instructionRow = createLessonRow(
      1,
      "Boxe débutant",
      "Boxe" as Sport,
      1,
      "Rotations épaules",
      "warmUp",
      2,
      2
    )

    const result = addInstructions(lesson, instructionRow)

    expect(result.warmUpInstructions).toHaveLength(2)
    expect(result.warmUpInstructions?.[1]).toEqual({
      text: "Rotations épaules",
      min: 2,
      sec: 0,
      order: 2,
    })
  })

  it("should handle body instructions", () => {
    const lesson = {
      lessonId: 1,
      userId: 1,
      title: "Boxe débutant",
      objective: "Apprendre les bases",
      creationDate: new Date("2026-01-01"),
      sport: "Boxe" as Sport,
    }

    const instructionRow = createLessonRow(
      1,
      "Boxe débutant",
      "Boxe" as Sport,
      1,
      "Technique du jab",
      "body",
      5,
      1
    )

    const result = addInstructions(lesson, instructionRow)

    expect(result.bodyInstructions).toEqual([
      { text: "Technique du jab", min: 5, sec: 0, order: 1 },
    ])
  })
})

describe("dbtoEntityMappingGetAll", () => {
  it("should handle single lesson with all instruction types", () => {
    const lessonDB = {
      rows: [
        createLessonRow(
          1,
          "Boxe débutant",
          "Boxe" as Sport,
          1,
          "Jumping jacks",
          "warmUp",
          3,
          1
        ),
        createLessonRow(
          1,
          "Boxe débutant",
          "Boxe" as Sport,
          1,
          "Technique du jab",
          "body",
          5,
          1
        ),
        createLessonRow(
          1,
          "Boxe débutant",
          "Boxe" as Sport,
          1,
          "Étirements",
          "coolDown",
          3,
          1
        ),
      ],
    }

    const result = dbtoEntityMappingGetAll(lessonDB)

    expect(result).toHaveLength(1)
    expect(result[0].lessonId).toBe(1)
    expect(result[0].warmUpInstructions).toHaveLength(1)
    expect(result[0].bodyInstructions).toHaveLength(1)
    expect(result[0].coolDownInstructions).toHaveLength(1)
  })

  it("should handle multiple lessons with multiple instructions", () => {
    const lessonDB = {
      rows: [
        createLessonRow(
          1,
          "Boxe débutant",
          "Boxe" as Sport,
          1,
          "Jumping jacks",
          "warmUp",
          3,
          1
        ),
        createLessonRow(
          1,
          "Boxe débutant",
          "Boxe" as Sport,
          1,
          "Rotations",
          "warmUp",
          2,
          2
        ),
        createLessonRow(
          1,
          "Boxe débutant",
          "Boxe" as Sport,
          1,
          "Jab",
          "body",
          5,
          1
        ),
        createLessonRow(
          2,
          "Judo avancé",
          "Judo" as Sport,
          2,
          "Course légère",
          "warmUp",
          3,
          1
        ),
        createLessonRow(
          2,
          "Judo avancé",
          "Judo" as Sport,
          2,
          "O-goshi",
          "body",
          6,
          1
        ),
        createLessonRow(
          2,
          "Judo avancé",
          "Judo" as Sport,
          2,
          "Seoi-nage",
          "body",
          6,
          2
        ),
        createLessonRow(
          3,
          "Karaté kata",
          "Karaté" as Sport,
          1,
          "Kihon",
          "warmUp",
          5,
          1
        ),
      ],
    }

    const result = dbtoEntityMappingGetAll(lessonDB)

    expect(result).toHaveLength(3)

    expect(result[0].lessonId).toBe(1)
    expect(result[0].title).toBe("Boxe débutant")
    expect(result[0].warmUpInstructions).toHaveLength(2)
    expect(result[0].bodyInstructions).toHaveLength(1)

    expect(result[1].lessonId).toBe(2)
    expect(result[1].title).toBe("Judo avancé")
    expect(result[1].warmUpInstructions).toHaveLength(1)
    expect(result[1].bodyInstructions).toHaveLength(2)

    expect(result[2].lessonId).toBe(3)
    expect(result[2].title).toBe("Karaté kata")
    expect(result[2].warmUpInstructions).toHaveLength(1)
  })

  it("should handle empty input", () => {
    const lessonDB = { rows: [] }
    const result = dbtoEntityMappingGetAll(lessonDB)
    expect(result).toEqual([])
  })

  it("should preserve instruction order", () => {
    const lessonDB = {
      rows: [
        createLessonRow(
          1,
          "Boxe",
          "Boxe" as Sport,
          1,
          "Instruction 3",
          "body",
          5,
          3
        ),
        createLessonRow(
          1,
          "Boxe",
          "Boxe" as Sport,
          1,
          "Instruction 1",
          "body",
          5,
          1
        ),
        createLessonRow(
          1,
          "Boxe",
          "Boxe" as Sport,
          1,
          "Instruction 2",
          "body",
          5,
          2
        ),
      ],
    }

    const result = dbtoEntityMappingGetAll(lessonDB)

    expect(result[0].bodyInstructions?.[0].order).toBe(3)
    expect(result[0].bodyInstructions?.[1].order).toBe(1)
    expect(result[0].bodyInstructions?.[2].order).toBe(2)
  })

  it("should handle lesson with only one type of instructions", () => {
    const lessonDB = {
      rows: [
        createLessonRow(1, "Boxe", "Boxe" as Sport, 1, "Jab", "body", 5, 1),
        createLessonRow(1, "Boxe", "Boxe" as Sport, 1, "Direct", "body", 5, 2),
      ],
    }

    const result = dbtoEntityMappingGetAll(lessonDB)

    expect(result).toHaveLength(1)
    expect(result[0].bodyInstructions).toHaveLength(2)
    expect(result[0].warmUpInstructions).toBeUndefined()
    expect(result[0].coolDownInstructions).toBeUndefined()
  })
})

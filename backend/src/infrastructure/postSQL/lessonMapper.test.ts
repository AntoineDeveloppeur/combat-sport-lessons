/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect } from "vitest"
import * as lessonMapper from "./lessonMapper"
import type { Sport } from "../../domain/type"

const createMockInstruction = (id: number, type: string, order: number) => ({
  instruction_id: id,
  text: `Texte ${id}`,
  type,
  min: 1,
  sec: 0,
  order,
  lesson_id: "lessonId123",
})

const createMockLesson = (sport: string = "Boxe") => ({
  lesson_id: "lessonId123",
  title: "Test Lesson",
  sport,
  objective: "Test Objective",
  warm_up: "custom",
  cool_down: "custom",
  warm_up_preset_title: null,
  cool_down_preset_title: null,
  created_at: "2026-03-03T13:09:51.605Z",
  user_id: "userId123",
  is_public: false,
})

const createMockDBResult = <T>(data: T) => ({ rows: [data] })
const createMockInstructionsDB = (instructions: any[]) => ({
  rows: instructions,
})

const createLessonRow = (
  lessonId: string,
  title: string,
  sport: Sport,
  userId: string,
  text: string,
  type: string,
  min: number,
  order: number,
) => ({
  lesson_id: lessonId,
  title,
  sport,
  objective: "Test objective",
  created_at: new Date("2026-01-01"),
  user_id: userId,
  is_public: false,
  text,
  type,
  min,
  sec: 0,
  order,
})

describe("mapOne", () => {
  it("should map basic lesson properties correctly", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const emptyInstructionsDB = createMockInstructionsDB([])

    const result = lessonMapper.mapOne(
      mockLessonDB,
      emptyInstructionsDB,
      emptyInstructionsDB,
      emptyInstructionsDB,
    )

    expect(result.lessonId).toBe("lessonId123")
    expect(result.title).toBe("Test Lesson")
    expect(result.sport).toBe("Boxe")
    expect(result.objective).toBe("Test Objective")
    expect(result.userId).toBe("userId123")
    expect(result.creationDate).toBeInstanceOf(Date)
    expect(result.creationDate.toISOString()).toBe("2026-03-03T13:09:51.605Z")
    expect(result.warmUpInstructions).toEqual([])
    expect(result.bodyInstructions).toEqual([])
    expect(result.coolDownInstructions).toEqual([])
  })

  it("should map instructions to correct categories", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const warmUpInstructions = [
      createMockInstruction(1, "warm_up", 1),
      createMockInstruction(2, "warm_up", 2),
    ]
    const bodyInstructions = [
      createMockInstruction(3, "body", 1),
      createMockInstruction(4, "body", 2),
    ]
    const coolDownInstructions = [createMockInstruction(5, "cool_down", 1)]

    const result = lessonMapper.mapOne(
      mockLessonDB,
      createMockInstructionsDB(warmUpInstructions),
      createMockInstructionsDB(bodyInstructions),
      createMockInstructionsDB(coolDownInstructions),
    )

    expect(result.warmUpInstructions).toHaveLength(2)
    expect(result.bodyInstructions).toHaveLength(2)
    expect(result.coolDownInstructions).toHaveLength(1)
    expect(result.warmUpInstructions[0].text).toBe("Texte 1")
    expect(result.bodyInstructions[0].text).toBe("Texte 3")
    expect(result.coolDownInstructions[0].text).toBe("Texte 5")
  })

  it("should handle sport type conversion", () => {
    const mockLessonDB = createMockDBResult(createMockLesson("Karaté"))
    const emptyInstructionsDB = createMockInstructionsDB([])

    const result = lessonMapper.mapOne(
      mockLessonDB,
      emptyInstructionsDB,
      emptyInstructionsDB,
      emptyInstructionsDB,
    )

    expect(result.sport).toBe("Karaté")
  })

  it("should handle empty instruction arrays", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const emptyInstructionsDB = createMockInstructionsDB([])

    const result = lessonMapper.mapOne(
      mockLessonDB,
      emptyInstructionsDB,
      emptyInstructionsDB,
      emptyInstructionsDB,
    )

    expect(result.warmUpInstructions).toEqual([])
    expect(result.bodyInstructions).toEqual([])
    expect(result.coolDownInstructions).toEqual([])
  })

  it("should preserve instruction order", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const instructions = [
      createMockInstruction(3, "warm_up", 3),
      createMockInstruction(1, "warm_up", 1),
      createMockInstruction(2, "warm_up", 2),
    ]

    const result = lessonMapper.mapOne(
      mockLessonDB,
      createMockInstructionsDB(instructions),
      createMockInstructionsDB([]),
      createMockInstructionsDB([]),
    )

    expect(result.warmUpInstructions[0].min).toBe(1)
    expect(result.warmUpInstructions[1].min).toBe(1)
    expect(result.warmUpInstructions[2].min).toBe(1)
  })
})

describe("addInstructions", () => {
  it("should add first coolDown instruction to lesson", () => {
    const lesson = {
      lessonId: "lessonId123",
      userId: "userId123",
      title: "Boxe débutant",
      objective: "Apprendre les bases",
      creationDate: new Date("2026-01-01"),
      sport: "Boxe" as Sport,
    }

    const instructionRow = createLessonRow(
      "lessonId123",
      "Boxe débutant",
      "Boxe" as Sport,
      "userId123",
      "Étirements bras",
      "cool_down",
      3,
      1,
    )

    const result = lessonMapper.addInstructions(lesson, instructionRow)

    expect(result.coolDownInstructions).toEqual([
      { text: "Étirements bras", min: 3, sec: 0, order: 1 },
    ])
  })

  it("should append instruction to existing array", () => {
    const lesson = {
      lessonId: "lessonId123",
      userId: "userId123",
      title: "Boxe débutant",
      objective: "Apprendre les bases",
      creationDate: new Date("2026-01-01"),
      sport: "Boxe" as Sport,
      warmUpInstructions: [{ text: "Jumping jacks", min: 3, sec: 0, order: 1 }],
    }

    const instructionRow = createLessonRow(
      "lessonId123",
      "Boxe débutant",
      "Boxe" as Sport,
      "userId123",
      "Rotations épaules",
      "warm_up",
      2,
      2,
    )

    const result = lessonMapper.addInstructions(lesson, instructionRow)

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
      lessonId: "lessonId123",
      userId: "userId123",
      title: "Boxe débutant",
      objective: "Apprendre les bases",
      creationDate: new Date("2026-01-01"),
      sport: "Boxe" as Sport,
    }

    const instructionRow = createLessonRow(
      "lessonId123",
      "Boxe débutant",
      "Boxe" as Sport,
      "userId123",
      "Technique du jab",
      "body",
      5,
      1,
    )

    const result = lessonMapper.addInstructions(lesson, instructionRow)

    expect(result.bodyInstructions).toEqual([
      { text: "Technique du jab", min: 5, sec: 0, order: 1 },
    ])
  })
})

describe("mapMany", () => {
  it("should handle single lesson with all instruction types", () => {
    const lessonDB = {
      rows: [
        createLessonRow(
          "lessonId123",
          "Boxe débutant",
          "Boxe" as Sport,
          "userId123",
          "Jumping jacks",
          "warm_up",
          3,
          1,
        ),
        createLessonRow(
          "lessonId123",
          "Boxe débutant",
          "Boxe" as Sport,
          "userId123",
          "Technique du jab",
          "body",
          5,
          1,
        ),
        createLessonRow(
          "lessonId123",
          "Boxe débutant",
          "Boxe" as Sport,
          "userId123",
          "Étirements",
          "cool_down",
          3,
          1,
        ),
      ],
    }

    const result = lessonMapper.mapMany(lessonDB)

    expect(result).toHaveLength(1)
    expect(result[0].lessonId).toBe("lessonId123")
    expect(result[0].warmUpInstructions).toHaveLength(1)
    expect(result[0].bodyInstructions).toHaveLength(1)
    expect(result[0].coolDownInstructions).toHaveLength(1)
  })

  it("should handle multiple lessons with multiple instructions", () => {
    const lessonDB = {
      rows: [
        createLessonRow(
          "lessonId123",
          "Boxe débutant",
          "Boxe" as Sport,
          "userId123",
          "Jumping jacks",
          "warm_up",
          3,
          1,
        ),
        createLessonRow(
          "lessonId123",
          "Boxe débutant",
          "Boxe" as Sport,
          "userId123",
          "Rotations",
          "warm_up",
          2,
          2,
        ),
        createLessonRow(
          "lessonId123",
          "Boxe débutant",
          "Boxe" as Sport,
          "userId123",
          "Jab",
          "body",
          5,
          1,
        ),
        createLessonRow(
          "lessonId456",
          "Judo avancé",
          "Judo" as Sport,
          "userId456",
          "Course légère",
          "warm_up",
          3,
          1,
        ),
        createLessonRow(
          "lessonId456",
          "Judo avancé",
          "Judo" as Sport,
          "userId456",
          "O-goshi",
          "body",
          6,
          1,
        ),
        createLessonRow(
          "lessonId456",
          "Judo avancé",
          "Judo" as Sport,
          "userId456",
          "Seoi-nage",
          "body",
          6,
          2,
        ),
        createLessonRow(
          "lessonId789",
          "Karaté kata",
          "Karaté" as Sport,
          "userId123",
          "Kihon",
          "warm_up",
          5,
          1,
        ),
      ],
    }

    const result = lessonMapper.mapMany(lessonDB)

    expect(result).toHaveLength(3)

    expect(result[0].lessonId).toBe("lessonId123")
    expect(result[0].title).toBe("Boxe débutant")
    expect(result[0].warmUpInstructions).toHaveLength(2)
    expect(result[0].bodyInstructions).toHaveLength(1)

    expect(result[1].lessonId).toBe("lessonId456")
    expect(result[1].title).toBe("Judo avancé")
    expect(result[1].warmUpInstructions).toHaveLength(1)
    expect(result[1].bodyInstructions).toHaveLength(2)

    expect(result[2].lessonId).toBe("lessonId789")
    expect(result[2].title).toBe("Karaté kata")
    expect(result[2].warmUpInstructions).toHaveLength(1)
  })

  it("should handle empty input", () => {
    const lessonDB = { rows: [] }
    const result = lessonMapper.mapMany(lessonDB)
    expect(result).toEqual([])
  })

  it("should preserve instruction order", () => {
    const lessonDB = {
      rows: [
        createLessonRow(
          "lessonId123",
          "Boxe",
          "Boxe" as Sport,
          "userId123",
          "Instruction 3",
          "body",
          5,
          3,
        ),
        createLessonRow(
          "lessonId123",
          "Boxe",
          "Boxe" as Sport,
          "userId123",
          "Instruction 1",
          "body",
          5,
          1,
        ),
        createLessonRow(
          "lessonId123",
          "Boxe",
          "Boxe" as Sport,
          "userId123",
          "Instruction 2",
          "body",
          5,
          2,
        ),
      ],
    }

    const result = lessonMapper.mapMany(lessonDB)

    expect(result[0].bodyInstructions?.[0].order).toBe(3)
    expect(result[0].bodyInstructions?.[1].order).toBe(1)
    expect(result[0].bodyInstructions?.[2].order).toBe(2)
  })

  it("should handle lesson with only one type of instructions", () => {
    const lessonDB = {
      rows: [
        createLessonRow(
          "1",
          "Boxe",
          "Boxe" as Sport,
          "userId123",
          "Jab",
          "body",
          5,
          1,
        ),
        createLessonRow(
          "1",
          "Boxe",
          "Boxe" as Sport,
          "userId123",
          "Direct",
          "body",
          5,
          2,
        ),
      ],
    }

    const result = lessonMapper.mapMany(lessonDB)

    expect(result).toHaveLength(1)
    expect(result[0].bodyInstructions).toHaveLength(2)
    expect(result[0].warmUpInstructions).toBeUndefined()
    expect(result[0].coolDownInstructions).toBeUndefined()
  })
})

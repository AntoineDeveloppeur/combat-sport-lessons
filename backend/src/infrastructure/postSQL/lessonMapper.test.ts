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
  lesson_id: 1,
})

const createMockLesson = (sport: string = "Boxe") => ({
  lesson_id: 1,
  title: "Test Lesson",
  sport,
  objective: "Test Objective",
  warmUp: "custom",
  coolDown: "custom",
  warmUpPresetTitle: null,
  coolDownPresetTitle: null,
  created_at: "2026-03-03T13:09:51.605Z",
  user_id: 1,
})

const createMockDBResult = <T>(data: T) => ({ rows: [data] })
const createMockInstructionsDB = (instructions: any[]) => ({
  rows: instructions,
})

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

describe("mapOne", () => {
  it("should map basic lesson properties correctly", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const emptyInstructionsDB = createMockInstructionsDB([])

    const result = lessonMapper.mapOne(
      mockLessonDB,
      emptyInstructionsDB,
      emptyInstructionsDB,
      emptyInstructionsDB
    )

    expect(result.lessonId).toBe(1)
    expect(result.title).toBe("Test Lesson")
    expect(result.sport).toBe("Boxe")
    expect(result.objective).toBe("Test Objective")
    expect(result.userId).toBe(1)
    expect(result.creationDate).toBeInstanceOf(Date)
    expect(result.creationDate.toISOString()).toBe("2026-03-03T13:09:51.605Z")
    expect(result.warmUpInstructions).toEqual([])
    expect(result.bodyInstructions).toEqual([])
    expect(result.coolDownInstructions).toEqual([])
  })

  it("should map instructions to correct categories", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const warmUpInstructions = [
      createMockInstruction(1, "warmUp", 1),
      createMockInstruction(2, "warmUp", 2),
    ]
    const bodyInstructions = [
      createMockInstruction(3, "body", 1),
      createMockInstruction(4, "body", 2),
    ]
    const coolDownInstructions = [createMockInstruction(5, "coolDown", 1)]

    const result = lessonMapper.mapOne(
      mockLessonDB,
      createMockInstructionsDB(warmUpInstructions),
      createMockInstructionsDB(bodyInstructions),
      createMockInstructionsDB(coolDownInstructions)
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
      emptyInstructionsDB
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
      emptyInstructionsDB
    )

    expect(result.warmUpInstructions).toEqual([])
    expect(result.bodyInstructions).toEqual([])
    expect(result.coolDownInstructions).toEqual([])
  })

  it("should preserve instruction order", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const instructions = [
      createMockInstruction(3, "warmUp", 3),
      createMockInstruction(1, "warmUp", 1),
      createMockInstruction(2, "warmUp", 2),
    ]

    const result = lessonMapper.mapOne(
      mockLessonDB,
      createMockInstructionsDB(instructions),
      createMockInstructionsDB([]),
      createMockInstructionsDB([])
    )

    expect(result.warmUpInstructions[0].min).toBe(1)
    expect(result.warmUpInstructions[1].min).toBe(1)
    expect(result.warmUpInstructions[2].min).toBe(1)
  })
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

    const result = lessonMapper.addInstructions(lesson, instructionRow)

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

    const result = lessonMapper.mapMany(lessonDB)

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

    const result = lessonMapper.mapMany(lessonDB)

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
    const result = lessonMapper.mapMany(lessonDB)
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

    const result = lessonMapper.mapMany(lessonDB)

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

    const result = lessonMapper.mapMany(lessonDB)

    expect(result).toHaveLength(1)
    expect(result[0].bodyInstructions).toHaveLength(2)
    expect(result[0].warmUpInstructions).toBeUndefined()
    expect(result[0].coolDownInstructions).toBeUndefined()
  })
})

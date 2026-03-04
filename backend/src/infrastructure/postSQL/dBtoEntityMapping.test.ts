/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest"
import { dBtoEntityMapping } from "./dBtoEntityMapping"

// Helpers pour créer des données mockées simples
const createMockInstruction = (id: number, type: string, order: number) => ({
  instruction_id: id,
  title: `Instruction ${id}`,
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

describe("dBtoEntityMapping", () => {
  it("should map basic lesson properties correctly", () => {
    const mockLessonDB = createMockDBResult(createMockLesson())
    const emptyInstructionsDB = createMockInstructionsDB([])

    const result = dBtoEntityMapping(
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

    const result = dBtoEntityMapping(
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

    const result = dBtoEntityMapping(
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

    const result = dBtoEntityMapping(
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

    const result = dBtoEntityMapping(
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

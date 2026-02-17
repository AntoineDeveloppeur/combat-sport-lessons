import { describe, test, expect, vi } from "vitest"
import { getInstructionDefaultValue } from "./getInstructionDefaultValue"

const mockDefaultValue = vi.hoisted(() => [{ text: "", min: 3, sec: 33 }])

vi.mock("@/data/instructionDefaultValues", () => ({
  defaultValues: mockDefaultValue,
}))

const mockAddInstruction = [{ text: "", min: 2, sec: 22 }]
const mockLesson = { warmUpInstructions: mockAddInstruction }
const mockFieldName = "warmUpInstructions"

describe("getInstructionDefaultValue", () => {
  test("return lesson if fieldName is a property of lesson exist", () => {
    expect(getInstructionDefaultValue(mockLesson, mockFieldName)).toBe(
      mockLesson
    )
  })

  test("return defaultValue if lesson doesn't exist", () => {
    const undefinedFieldName = "bodyInstructions"
    const result = getInstructionDefaultValue(mockLesson, undefinedFieldName)

    expect(result).not.toBe(mockLesson)
    expect(result).toEqual({
      [undefinedFieldName]: mockDefaultValue,
    })
  })
})

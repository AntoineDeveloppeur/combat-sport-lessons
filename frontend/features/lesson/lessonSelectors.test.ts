import { describe, it, expect } from "vitest"
import { selectlesson } from "./lessonSelectors"
import type { RootState } from "@/store"
import type { Lesson } from "@/types"

describe("lessonSelectors", () => {
  describe("selectlesson", () => {
    it("should select the lesson value from state", () => {
      const mockLesson: Lesson = {
        sport: "Boxing",
        objective: "Improve stamina",
        warmUp: "custom",
        coolDown: "preset",
        warmUpInstructions: [{ text: "Jumping jacks", min: 5, sec: 0 }],
        bodyInstructions: [{ text: "Shadow boxing", min: 10, sec: 30 }],
        coolDownInstructions: [{ text: "Stretching", min: 3, sec: 0 }],
      }

      const state: RootState = {
        lesson: {
          value: mockLesson,
        },
      }

      const result = selectlesson(state)

      expect(result).toEqual(mockLesson)
    })

    it("should select empty lesson when state has minimal data", () => {
      const mockLesson: Lesson = {
        warmUp: "custom",
        coolDown: "custom",
      }

      const state: RootState = {
        lesson: {
          value: mockLesson,
        },
      }

      const result = selectlesson(state)

      expect(result).toEqual(mockLesson)
    })

    it("should return the exact reference from state", () => {
      const mockLesson: Lesson = {
        warmUp: "preset",
      }

      const state: RootState = {
        lesson: {
          value: mockLesson,
        },
      }

      const result = selectlesson(state)

      expect(result).toBe(mockLesson)
    })

    it("should select lesson with all instruction arrays", () => {
      const mockLesson: Lesson = {
        warmUp: "custom",
        coolDown: "custom",
        warmUpInstructions: [
          { text: "Exercise 1", min: 1, sec: 30 },
          { text: "Exercise 2", min: 2, sec: 0 },
        ],
        bodyInstructions: [
          { text: "Main exercise 1", min: 5, sec: 0 },
          { text: "Main exercise 2", min: 10, sec: 0 },
        ],
        coolDownInstructions: [{ text: "Cool down", min: 3, sec: 0 }],
      }

      const state: RootState = {
        lesson: {
          value: mockLesson,
        },
      }

      const result = selectlesson(state)

      expect(result.warmUpInstructions).toHaveLength(2)
      expect(result.bodyInstructions).toHaveLength(2)
      expect(result.coolDownInstructions).toHaveLength(1)
    })
  })
})

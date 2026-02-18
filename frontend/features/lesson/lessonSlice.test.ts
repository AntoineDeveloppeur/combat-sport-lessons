import { describe, it, expect } from "vitest"
import { lessonSlice, save } from "./lessonSlice"
import type { Lesson } from "@/types"

describe("lessonSlice", () => {
  describe("reducer", () => {
    it("should return the initial state", () => {
      const state = lessonSlice.reducer(undefined, { type: "unknown" })

      expect(state.value).toHaveProperty("warmUp", "custom")
      expect(state.value).toHaveProperty("coolDown", "custom")
      expect(state.value).toHaveProperty("warmUpInstructions")
      expect(state.value).toHaveProperty("bodyInstructions")
      expect(state.value).toHaveProperty("coolDownInstructions")
    })

    it("should have correct initial instruction arrays", () => {
      const state = lessonSlice.reducer(undefined, { type: "unknown" })

      expect(state.value.warmUpInstructions).toHaveLength(1)
      expect(state.value.bodyInstructions).toHaveLength(1)
      expect(state.value.coolDownInstructions).toHaveLength(1)
      expect(state.value.warmUpInstructions?.[0]).toEqual({
        text: "",
        min: 1,
        sec: 0,
      })
    })
  })

  describe("save action", () => {
    it("should save a complete lesson", () => {
      const initialState = lessonSlice.reducer(undefined, { type: "unknown" })

      const newLesson: Lesson = {
        sport: "Karate",
        objective: "Improve kicks",
        warmUp: "preset",
        coolDown: "custom",
        warmUpInstructions: [{ text: "Warm up exercise", min: 5, sec: 0 }],
        bodyInstructions: [{ text: "Main exercise", min: 10, sec: 30 }],
        coolDownInstructions: [{ text: "Stretching", min: 3, sec: 0 }],
      }

      const state = lessonSlice.reducer(initialState, save(newLesson))

      expect(state.value).toEqual(newLesson)
    })

    it("should save a partial lesson", () => {
      const initialState = lessonSlice.reducer(undefined, { type: "unknown" })

      const partialLesson: Lesson = {
        sport: "Boxing",
        objective: "Build endurance",
      }

      const state = lessonSlice.reducer(initialState, save(partialLesson))

      expect(state.value).toEqual(partialLesson)
      expect(state.value.sport).toBe("Boxing")
      expect(state.value.objective).toBe("Build endurance")
    })

    it("should override previous lesson data", () => {
      const firstLesson: Lesson = {
        sport: "Judo",
        warmUp: "custom",
      }

      let state = lessonSlice.reducer(undefined, save(firstLesson))
      expect(state.value.sport).toBe("Judo")

      const secondLesson: Lesson = {
        sport: "Taekwondo",
        warmUp: "preset",
      }

      state = lessonSlice.reducer(state, save(secondLesson))

      expect(state.value.sport).toBe("Taekwondo")
      expect(state.value.warmUp).toBe("preset")
    })

    it("should save lesson with empty instruction arrays", () => {
      const initialState = lessonSlice.reducer(undefined, { type: "unknown" })

      const lessonWithEmptyArrays: Lesson = {
        warmUp: "custom",
        coolDown: "custom",
        warmUpInstructions: [],
        bodyInstructions: [],
        coolDownInstructions: [],
      }

      const state = lessonSlice.reducer(
        initialState,
        save(lessonWithEmptyArrays)
      )

      expect(state.value.warmUpInstructions).toEqual([])
      expect(state.value.bodyInstructions).toEqual([])
      expect(state.value.coolDownInstructions).toEqual([])
    })

    it("should save lesson with multiple instructions", () => {
      const initialState = lessonSlice.reducer(undefined, { type: "unknown" })

      const lessonWithMultipleInstructions: Lesson = {
        warmUp: "custom",
        warmUpInstructions: [
          { text: "Exercise 1", min: 2, sec: 0 },
          { text: "Exercise 2", min: 3, sec: 30 },
          { text: "Exercise 3", min: 1, sec: 15 },
        ],
      }

      const state = lessonSlice.reducer(
        initialState,
        save(lessonWithMultipleInstructions)
      )

      expect(state.value.warmUpInstructions).toHaveLength(3)
      expect(state.value.warmUpInstructions?.[1]).toEqual({
        text: "Exercise 2",
        min: 3,
        sec: 30,
      })
    })

    it("should handle lesson with only required fields", () => {
      const initialState = lessonSlice.reducer(undefined, { type: "unknown" })

      const minimalLesson: Lesson = {}

      const state = lessonSlice.reducer(initialState, save(minimalLesson))

      expect(state.value).toEqual({})
    })
  })

  describe("slice configuration", () => {
    it("should have correct slice name", () => {
      expect(lessonSlice.name).toBe("lesson")
    })

    it("should export save action", () => {
      expect(save).toBeDefined()
      expect(typeof save).toBe("function")
    })

    it("should create action with correct type", () => {
      const lesson: Lesson = { sport: "MMA" }
      const action = save(lesson)

      expect(action.type).toBe("lesson/save")
      expect(action.payload).toEqual(lesson)
    })
  })
})

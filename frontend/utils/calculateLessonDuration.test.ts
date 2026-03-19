import { describe, it, expect } from "vitest"
import { calculateLessonDuration } from "./calculateLessonDuration"
import { Lesson } from "@/types"

describe("calculateLessonDuration", () => {
  it("calculates total duration and rounds up to nearest minute", () => {
    const mockLesson: Lesson = {
      bodyInstructions: [
        {
          sec: 23,
          min: 1,
          text: "ddddddddddd",
        },
        {
          sec: 50,
          min: 3,
          text: "qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
      ],
      warmUpInstructions: [
        {
          text: "ddddddddd ddddddddddddddddddddd dddddddddddddddddddd ddddddddddddddddddddddddd sssssssssssssss ssssssssss ssssss s s sssssssssssssss ssssssssssssssssssssssssssss s",
          min: 1,
          sec: 0,
        },
        {
          sec: 0,
          min: 2,
          text: "ssssssssssssssssssssssssss",
        },
      ],
      coolDownInstructions: [
        {
          text: "",
          min: 1,
          sec: 0,
        },
      ],
    }

    expect(calculateLessonDuration(mockLesson)).toBe(10)
  })

  it("returns 0 for lesson with no instructions", () => {
    const emptyLesson: Lesson = {}
    expect(calculateLessonDuration(emptyLesson)).toBe(0)
  })

  it("rounds up partial minutes", () => {
    const lessonWithPartialMinute: Lesson = {
      bodyInstructions: [
        {
          min: 2,
          sec: 30,
          text: "Exercise 1",
        },
      ],
    }
    expect(calculateLessonDuration(lessonWithPartialMinute)).toBe(3)
  })

  it("handles exact minutes without rounding up", () => {
    const lessonExactMinutes: Lesson = {
      warmUpInstructions: [
        {
          min: 5,
          sec: 0,
          text: "Warm up",
        },
      ],
      bodyInstructions: [
        {
          min: 10,
          sec: 0,
          text: "Main exercise",
        },
      ],
    }
    expect(calculateLessonDuration(lessonExactMinutes)).toBe(15)
  })

  it("handles only seconds that round up to minutes", () => {
    const lessonOnlySeconds: Lesson = {
      bodyInstructions: [
        {
          min: 0,
          sec: 30,
          text: "Quick exercise",
        },
        {
          min: 0,
          sec: 45,
          text: "Another quick one",
        },
      ],
    }
    expect(calculateLessonDuration(lessonOnlySeconds)).toBe(2)
  })
})

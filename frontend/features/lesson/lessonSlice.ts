import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Lesson } from "@/types"
import { defaultValues } from "@/data/instructionDefaultValues"
import { calculateLessonDuration } from "@/utils/calculateLessonDuration"

export interface LessonState {
  value: Lesson
}

const initialState: LessonState = {
  value: {
    warmUp: "custom",
    coolDown: "custom",
    warmUpInstructions: defaultValues,
    bodyInstructions: defaultValues,
    coolDownInstructions: defaultValues,
    userId: "userId123",
  },
}

export const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<Lesson>) => {
      const lesson = action.payload
      const duration = calculateLessonDuration(lesson)
      state.value = { ...lesson, duration }
    },
  },
})

export const { save } = lessonSlice.actions

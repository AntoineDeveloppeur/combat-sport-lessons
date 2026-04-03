import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Lesson } from "@/types"
import { defaultValues } from "@/data/instructionDefaultValues"
import { calculateLessonDuration } from "@/utils/calculateLessonDuration"

export interface LessonFormState {
  value: Lesson
}

const initialState: LessonFormState = {
  value: {
    warmUp: "custom",
    coolDown: "custom",
    warmUpInstructions: defaultValues,
    bodyInstructions: defaultValues,
    coolDownInstructions: defaultValues,
  },
}

export const lessonFormSlice = createSlice({
  name: "lessonForm",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<Lesson>) => {
      const lesson = action.payload
      const duration = calculateLessonDuration(lesson)
      state.value = { ...lesson, duration }
    },
  },
})

export const { save } = lessonFormSlice.actions

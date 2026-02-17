import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Lesson } from "@/types"
import { defaultValues } from "@/data/instructionDefaultValues"

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
  },
}

export const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<Lesson>) => {
      state.value = action.payload
    },
  },
})

export const { save } = lessonSlice.actions

import type { RootState } from "@/store"

export const selectLessonForm = (state: RootState) => state.lessonForm.value

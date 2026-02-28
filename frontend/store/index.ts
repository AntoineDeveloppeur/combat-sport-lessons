import { lessonSlice } from "@/features/lesson/lessonSlice"
import { configureStore } from "@reduxjs/toolkit"
import { lessonApi } from "./api/lessonApi"
export const store = configureStore({
  reducer: {
    lesson: lessonSlice.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer, // Ajoute le reducer de l'API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(lessonApi.middleware), // Ajoute le middleware
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

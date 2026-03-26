import { lessonSlice } from "@/features/lesson/lessonSlice"
import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./api/authAPI"
import { lessonApi } from "./api/lessonApi"
export const store = configureStore({
  reducer: {
    lesson: lessonSlice.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer, // Ajoute le reducer de l'API
    [authApi.reducerPath]: authApi.reducer, // Ajoute le reducer de l'API Auth
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(lessonApi.middleware, authApi.middleware), // Ajoute les middlewares
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

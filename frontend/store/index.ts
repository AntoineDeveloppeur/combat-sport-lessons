import { lessonFormSlice } from "@/features/lessonForm/lessonFormSlice"
import { configureStore } from "@reduxjs/toolkit"
import { userApi } from "./api/userAPI"
import { lessonApi } from "./api/lessonApi"
export const store = configureStore({
  reducer: {
    lessonForm: lessonFormSlice.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer, // Ajoute le reducer de l'API
    [userApi.reducerPath]: userApi.reducer, // Ajoute le reducer de l'API user
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(lessonApi.middleware, userApi.middleware), // Ajoute les middlewares
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

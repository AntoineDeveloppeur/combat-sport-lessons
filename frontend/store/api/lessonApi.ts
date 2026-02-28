import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Lesson } from "@/types"

export const lessonApi = createApi({
  reducerPath: "lessonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Lesson"],
  endpoints: (builder) => ({
    saveLesson: builder.mutation<Lesson, Lesson>({
      query: (lesson) => ({
        url: "/lessons",
        method: "POST",
        body: lesson,
      }),
      invalidatesTags: ["Lesson"],
    }),
  }),
})

export const { useSaveLessonMutation } = lessonApi

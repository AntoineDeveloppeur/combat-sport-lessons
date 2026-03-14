import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Lesson } from "@/types"

export const lessonApi = createApi({
  reducerPath: "lessonApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
  tagTypes: ["Lesson"],
  endpoints: (builder) => ({
    getLesson: builder.query<{ lesson: Lesson }, number>({
      query: (id) => `/lessons/${id}`,
      providesTags: ["Lesson"],
    }),
    getAllLessons: builder.query<{ lessons: Lesson[] }, void>({
      query: () => "/lessons",
    }),
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

export const {
  useGetLessonQuery,
  useSaveLessonMutation,
  useGetAllLessonsQuery,
} = lessonApi

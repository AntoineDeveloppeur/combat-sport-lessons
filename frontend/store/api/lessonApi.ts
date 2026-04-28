import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Lesson } from "@/types"

export const lessonApi = createApi({
  reducerPath: "lessonApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ["Lesson"],
  endpoints: (builder) => ({
    getLesson: builder.query<{ lesson: Lesson }, string>({
      query: (id) => `/lessons/${id}`,
      providesTags: ["Lesson"],
    }),
    getAllLessons: builder.query<{ lessons: Lesson[] }, void>({
      query: () => "/lessons",
      providesTags: ["Lesson"],
    }),
    postLesson: builder.mutation<Lesson, { lesson: Lesson; token: string }>({
      query: ({ lesson, token }) => ({
        url: "/lessons",
        method: "POST",
        body: { lesson, token },
      }),
      invalidatesTags: ["Lesson"],
    }),
    deleteLesson: builder.mutation<void, { lessonId: string; token: string }>({
      query: ({ lessonId, token }) => ({
        url: `/lessons/${lessonId}`,
        method: "DELETE",
        body: { token },
      }),
      invalidatesTags: ["Lesson"],
    }),
    updateLesson: builder.mutation<
      { lesson: Lesson },
      { lessonId: string; lesson: Lesson; token: string }
    >({
      query: ({ lessonId, lesson, token }) => ({
        url: `/lessons/${lessonId}`,
        method: "PUT",
        body: { lesson, token },
      }),
      invalidatesTags: ["Lesson"],
    }),
    duplicateLesson: builder.mutation<
      { lesson: Lesson },
      { lessonId: string; token: string }
    >({
      query: ({ lessonId, token }) => ({
        url: `/lessons/${lessonId}/duplicate`,
        method: "POST",
        body: { token },
      }),
      invalidatesTags: ["Lesson"],
    }),
    toggleLessonVisibility: builder.mutation<
      void,
      { lessonId: string; token: string }
    >({
      query: ({ lessonId, token }) => ({
        url: `/lessons/${lessonId}/visibility`,
        method: "PATCH",
        body: { token },
      }),
      invalidatesTags: ["Lesson"],
    }),
  }),
})

export const {
  useGetLessonQuery,
  usePostLessonMutation,
  useGetAllLessonsQuery,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
  useDuplicateLessonMutation,
  useToggleLessonVisibilityMutation,
} = lessonApi

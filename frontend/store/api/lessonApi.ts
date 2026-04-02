import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Lesson } from "@/types"

export const lessonApi = createApi({
  reducerPath: "lessonApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL }),
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
    deleteLesson: builder.mutation<void, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lesson"],
    }),
    updateLesson: builder.mutation<Lesson, { id: string; lesson: Lesson }>({
      query: ({ id, lesson }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body: lesson,
      }),
      invalidatesTags: ["Lesson"],
    }),
    duplicateLesson: builder.mutation<Lesson, Lesson>({
      query: (lesson) => ({
        url: "/lessons",
        method: "POST",
        body: {
          ...lesson,
          lessonId: undefined,
          title: `${lesson.title} (copie)`,
        },
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

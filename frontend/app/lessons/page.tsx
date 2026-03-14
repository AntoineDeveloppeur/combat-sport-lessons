"use client"

import { LessonTable } from "@/components/lessonTable/LessonTable"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"

export default function LessonsPage() {
  const { data, isLoading } = useGetAllLessonsQuery()

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mes Lessons</h1>
        <p className="text-muted-foreground mt-2">
          Gérez et consultez toutes vos lessons de combat
        </p>
      </div>
      {!isLoading && data?.lessons && <LessonTable data={data.lessons} />}
    </div>
  )
}

"use client"

import { LessonTable } from "@/components/lessonTable/LessonTable"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMemo } from "react"

export default function LessonsVisitorPage() {
  const { data, isLoading } = useGetAllLessonsQuery()

  const publicLessons = useMemo(() => {
    if (!data?.lessons) return []
    return data.lessons.filter((lesson) => lesson.isPublic === true)
  }, [data])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leçons de sports de combat</h1>
        <p className="text-muted-foreground mt-2">
          Consultez toutes les lessons disponibles
        </p>
      </div>

      <div className="mb-6">
        <Link href="/sign-up">
          <Button size="lg">Créer votre première lesson</Button>
        </Link>
      </div>

      {!isLoading && <LessonTable data={publicLessons} showActions={false} />}
    </div>
  )
}

"use client"

import { LessonTable } from "@/components/lessonTable/LessonTable"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { LessonFilters } from "@/components/lessonTable/LessonFilters"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAppDispatch } from "@/store/hooks"
import { reset } from "@/features/lessonForm/lessonFormSlice"

export default function LessonsUserPage() {
  const { isAuthenticated, userId } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()

  if (!isAuthenticated) {
    router.push("/login")
  }

  const { data, isLoading } = useGetAllLessonsQuery()

  const [activeFilter, setActiveFilter] = useState<"all" | "mine">("all")

  const filteredLessons = useMemo(() => {
    if (!data?.lessons) return []
    if (activeFilter === "mine") {
      return data.lessons.filter((lesson) => lesson.userId === userId)
    } else {
      return data.lessons.filter((lesson) => lesson.isPublic === true)
    }
  }, [data, activeFilter, userId])

  const handleCreateLesson = () => {
    dispatch(reset())
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leçons de sport de combat</h1>
        <p className="text-muted-foreground mt-2">
          Gérez et consultez toutes les leçons
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <LessonFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <Button variant="outline" asChild>
          <Link href="/form/general" onClick={handleCreateLesson}>
            Créer une leçon
          </Link>
        </Button>
      </div>

      {!isLoading && (
        <LessonTable
          data={filteredLessons}
          userId={userId || undefined}
          showActions={true}
        />
      )}
    </div>
  )
}

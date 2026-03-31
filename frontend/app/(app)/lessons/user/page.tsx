"use client"

import { LessonTable } from "@/components/lessonTable/LessonTable"
import {
  useGetAllLessonsQuery,
  useDeleteLessonMutation,
  useDuplicateLessonMutation,
} from "@/store/api/lessonApi"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { LessonFilters } from "@/components/lessonTable/LessonFilters"
import { Lesson } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LessonsUserPage() {
  const { data, isLoading } = useGetAllLessonsQuery()
  const { isAuthenticated, userId } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<"all" | "mine">("all")
  const [deleteLesson] = useDeleteLessonMutation()
  const [duplicateLesson] = useDuplicateLessonMutation()

  const filteredLessons = useMemo(() => {
    if (!data?.lessons) return []
    if (activeFilter === "mine") {
      return data.lessons.filter((lesson) => lesson.userId === userId)
    }
    return data.lessons
  }, [data, activeFilter, userId])

  const handleEdit = (lessonId: string) => {
    router.push(`/form/${lessonId}`)
  }

  const handleDelete = async (lessonId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette lesson ?")) {
      try {
        await deleteLesson(lessonId).unwrap()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de la lesson")
      }
    }
  }

  const handleDuplicate = async (lesson: Lesson) => {
    try {
      await duplicateLesson(lesson).unwrap()
    } catch (error) {
      console.error("Erreur lors de la duplication:", error)
      alert("Erreur lors de la duplication de la lesson")
    }
  }

  if (!isAuthenticated) {
    router.push("/login")
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
          <Link href="/form/general">Créer une leçon</Link>
        </Button>
      </div>

      {!isLoading && (
        <LessonTable
          data={filteredLessons}
          userId={userId || undefined}
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      )}
    </div>
  )
}

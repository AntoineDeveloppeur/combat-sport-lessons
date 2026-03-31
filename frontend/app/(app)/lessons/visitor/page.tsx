"use client"

import { LessonTable } from "@/components/lessonTable/LessonTable"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import { Lesson } from "@/types"

export default function LessonsVisitorPage() {
  const { data, isLoading } = useGetAllLessonsQuery()

  const handleRowClick = (lesson: Lesson) => {
    buildAndDownloadPdf(lesson)
  }

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

      {!isLoading && data?.lessons && (
        <LessonTable data={data.lessons} showActions={false} />
      )}
    </div>
  )
}

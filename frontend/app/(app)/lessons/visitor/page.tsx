"use client"

import { LessonTable } from "@/components/lessonTable/LessonTable"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LessonsVisitorPage() {
  const { data, isLoading } = useGetAllLessonsQuery()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/lessons/user")
    }
  }, [isAuthenticated, router])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Découvrez les Lessons</h1>
        <p className="text-muted-foreground mt-2">
          Consultez toutes les lessons de combat disponibles
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

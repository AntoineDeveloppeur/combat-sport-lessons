"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDots } from "@tabler/icons-react"
import { Lesson } from "@/types"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import {
  useDeleteLessonMutation,
  useDuplicateLessonMutation,
} from "@/store/api/lessonApi"
import { useRouter } from "next/navigation"
interface LessonActionsProps {
  lesson: Lesson
  isOwner: boolean
}

export function LessonActions({ lesson, isOwner }: LessonActionsProps) {
  const handleDownload = () => {
    buildAndDownloadPdf(lesson)
  }

  const router = useRouter()
  const handleEdit = () => {
    router.push(`/form/${lesson.id}`)
  }

  const [deleteLesson] = useDeleteLessonMutation()
  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette lesson ?")) {
      try {
        await deleteLesson(lesson.id as string).unwrap()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        alert("Erreur lors de la suppression de la lesson")
      }
    }
  }

  const [duplicateLesson] = useDuplicateLessonMutation()
  const handleDuplicate = async () => {
    try {
      await duplicateLesson(lesson).unwrap()
    } catch (error) {
      console.error("Erreur lors de la duplication:", error)
      alert("Erreur lors de la duplication de la lesson")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOwner && (
          <>
            <DropdownMenuItem onClick={() => handleEdit()}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete()}
              className="text-red-600"
            >
              Supprimer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => handleDuplicate()}>
          Dupliquer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload()}>
          Télécharger
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

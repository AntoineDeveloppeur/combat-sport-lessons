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
  useToggleLessonVisibilityMutation,
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
    router.push(`/form/${lesson.lessonId}`)
  }

  const [deleteLesson] = useDeleteLessonMutation()
  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette lesson ?")) {
      try {
        await deleteLesson(lesson.lessonId as string).unwrap()
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

  const [toggleVisibility] = useToggleLessonVisibilityMutation()
  const handleToggleVisibility = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Vous devez être connecté pour modifier la visibilité")
      return
    }
    try {
      await toggleVisibility({
        lessonId: lesson.lessonId as string,
        token,
      }).unwrap()
    } catch (error) {
      console.error("Erreur lors du changement de visibilité:", error)
      alert("Erreur lors du changement de visibilité de la lesson")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
        >
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOwner && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
            >
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleToggleVisibility()
              }}
            >
              {lesson.isPublic ? "Rendre privée" : "Rendre publique"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
              className="text-red-600"
            >
              Supprimer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleDuplicate()
          }}
        >
          Dupliquer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
        >
          Télécharger
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

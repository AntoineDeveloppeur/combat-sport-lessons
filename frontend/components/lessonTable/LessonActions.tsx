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
import { useAppDispatch } from "@/store/hooks"
import { save } from "@/features/lessonForm/lessonFormSlice"

interface LessonActionsProps {
  lesson: Lesson
  isOwner: boolean
}

export function LessonActions({ lesson, isOwner }: LessonActionsProps) {
  const handleDownload = () => {
    buildAndDownloadPdf(lesson)
  }

  const router = useRouter()
  const dispatch = useAppDispatch()
  const handleEdit = () => {
    dispatch(save(lesson))
    router.push("/form/general")
  }

  const [deleteLesson] = useDeleteLessonMutation()
  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Vous devez être connecté pour supprimer une leçon")
      return
    }
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette lesson ?")) {
      try {
        await deleteLesson({
          lessonId: lesson.lessonId as string,
          token,
        }).unwrap()
        alert("Leçon supprimée avec succès")
      } catch (error) {
        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error.data as { error?: string })?.error
            : undefined
        alert(errorMessage || "Erreur lors de la suppression de la leçon")
      }
    }
  }

  const [duplicateLesson] = useDuplicateLessonMutation()
  const handleDuplicate = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Vous devez être connecté pour dupliquer une leçon")
      return
    }
    try {
      await duplicateLesson({
        lessonId: lesson.lessonId as string,
        token,
      }).unwrap()
      alert("Leçon dupliquée avec succès ! Disponible dans 'Mes leçons'")
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { error?: string })?.error
          : undefined
      alert(errorMessage || "Erreur lors de la duplication de la leçon")
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
    } catch {
      alert("Erreur lors du changement de visibilité de la lesson")
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

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

interface LessonActionsProps {
  lesson: Lesson
  isOwner: boolean
  onEdit?: (lessonId: string) => void
  onDelete?: (lessonId: string) => void
  onDuplicate?: (lesson: Lesson) => void
}

export function LessonActions({
  lesson,
  isOwner,
  onEdit,
  onDelete,
  onDuplicate,
}: LessonActionsProps) {
  const handleDownload = () => {
    buildAndDownloadPdf(lesson)
  }

  const handleEdit = () => {
    if (onEdit && lesson.id) {
      onEdit(lesson.id)
    }
  }

  const handleDelete = () => {
    if (onDelete && lesson.id) {
      onDelete(lesson.id)
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(lesson)
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
        {isOwner ? (
          <>
            <DropdownMenuItem onClick={handleEdit}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Supprimer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownload}>
              Télécharger
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleDuplicate}>
              Dupliquer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              Télécharger
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

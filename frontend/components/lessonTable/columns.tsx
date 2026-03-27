import { ColumnDef } from "@tanstack/react-table"
import { Lesson } from "@/types"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconArrowUp, IconArrowDown, IconSelector } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { displayDuration } from "@/utils/displayDuration"
import { LessonActions } from "./LessonActions"

interface ColumnsConfig {
  showActions?: boolean
  userId?: string
  onEdit?: (lessonId: string) => void
  onDelete?: (lessonId: string) => void
  onDuplicate?: (lesson: Lesson) => void
}

export const getColumns = (config: ColumnsConfig = {}): ColumnDef<Lesson>[] => {
  const baseColumns: ColumnDef<Lesson>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Titre
            {column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 size-4" />
            ) : column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 size-4" />
            ) : (
              <IconSelector className="ml-2 size-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="font-medium">
            {row.getValue("title") || "pas de titre"}
          </div>
        )
      },
    },
    {
      accessorKey: "sport",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Sport
            {column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 size-4" />
            ) : column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 size-4" />
            ) : (
              <IconSelector className="ml-2 size-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="font-normal">
            {row.getValue("sport")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "objective",
      header: "Objectif",
      cell: ({ row }) => {
        const objective =
          (row.getValue("objective") as string) || "pas d'objectif"
        const truncated =
          objective.length > 50
            ? objective.substring(0, objective.lastIndexOf(" ", 50)) + "..."
            : objective

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[300px] cursor-help">{truncated}</div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[400px]">
                <p>{objective}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Durée
            {column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 size-4" />
            ) : column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 size-4" />
            ) : (
              <IconSelector className="ml-2 size-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const duration = (row.getValue("duration") as number) || 0
        const durationDisplayed = displayDuration(duration)
        return <div className="text-right">{durationDisplayed}</div>
      },
    },
    {
      accessorKey: "creationDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Créée
            {column.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 size-4" />
            ) : column.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 size-4" />
            ) : (
              <IconSelector className="ml-2 size-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("creationDate") as
          | string
          | Date
          | null
          | undefined
        if (!date) return <div>-</div>

        const dateObj = typeof date === "string" ? new Date(date) : date
        return <div>{dateObj.toLocaleDateString("fr-FR")}</div>
      },
    },
  ]

  if (config.showActions && config.userId) {
    baseColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const lesson = row.original
        const isOwner = lesson.userId === config.userId
        return (
          <LessonActions
            lesson={lesson}
            isOwner={isOwner}
            onEdit={config.onEdit}
            onDelete={config.onDelete}
            onDuplicate={config.onDuplicate}
          />
        )
      },
    })
  }

  return baseColumns
}

export const columns = getColumns()

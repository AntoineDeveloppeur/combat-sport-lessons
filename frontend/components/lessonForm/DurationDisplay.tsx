"use client"

import { useAppSelector } from "@/store/hooks"
import { selectLessonForm } from "@/features/lessonForm/lessonFormSelectors"
import { calculateLessonDuration } from "@/utils/calculateLessonDuration"
import { displayDuration } from "@/utils/displayDuration"

export default function DurationDisplay() {
  const lesson = useAppSelector(selectLessonForm)
  const duration = calculateLessonDuration(lesson)
  const durationText = displayDuration(duration)

  return (
    <div className="w-full py-4 px-6 rounded-lg">
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Durée totale de la leçon
        </span>
        <span className="text-m font-medium text-foreground">
          {durationText}
        </span>
      </div>
    </div>
  )
}

"use client"

import { useAppDispatch } from "@/store/hooks"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import { Button } from "../ui/button"
import { save } from "@/features/lessonForm/lessonFormSlice"
import type { Lesson } from "@/types"

interface DownLoadPdfButtonProps {
  getFormValues: () => Lesson
}

export default function DownLoadPdfButton({
  getFormValues,
}: DownLoadPdfButtonProps) {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    const currentLesson = getFormValues()
    dispatch(save(currentLesson))
    buildAndDownloadPdf(currentLesson)
  }

  return <Button onClick={handleClick}>voir la leçon</Button>
}

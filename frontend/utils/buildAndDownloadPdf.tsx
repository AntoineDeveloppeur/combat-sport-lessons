import { pdf } from "@react-pdf/renderer"
import { Lesson } from "@/types"
import { LessonPdfDocument } from "@/components/pdf/LessonPdfDocument"

export const buildAndDownloadPdf = async (lesson: Lesson): Promise<void> => {
  const blob = await pdf(<LessonPdfDocument lesson={lesson} />).toBlob()

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `lesson-${lesson.sport || "document"}.pdf`
  link.click()

  URL.revokeObjectURL(url)
}

import { selectLessonForm } from "@/features/lessonForm/lessonFormSelectors"
import { useAppSelector } from "@/store/hooks"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import { Button } from "../ui/button"

export default function DownLoadPdfButton() {
  const lesson = useAppSelector(selectLessonForm)

  const handleClick = () => {
    buildAndDownloadPdf(lesson)
  }

  return <Button onClick={handleClick}>Télécharge la lesson</Button>
}

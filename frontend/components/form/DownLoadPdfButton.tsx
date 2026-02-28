import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import { Button } from "../ui/button"
import { mockLesson } from "@/data/mockLesson"

export default function DownLoadPdfButton() {
  // const lesson = useAppSelector(selectlesson)

  const handleClick = () => {
    buildAndDownloadPdf(mockLesson)
  }

  return <Button onClick={handleClick}>Télécharge la lesson</Button>
}

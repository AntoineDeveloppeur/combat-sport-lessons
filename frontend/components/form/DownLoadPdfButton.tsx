import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import { Button } from "../ui/button"

export default function DownLoadPdfButton() {
  const lesson = useAppSelector(selectlesson)

  const handleClick = () => {
    buildAndDownloadPdf(lesson)
  }

  return <Button onClick={handleClick}>Télécharge la lesson</Button>
}

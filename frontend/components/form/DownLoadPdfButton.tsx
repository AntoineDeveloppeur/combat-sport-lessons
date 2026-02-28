import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import { buildPdf } from "@/utils/buildPdf"
import { Button } from "../ui/button"
import { mockLesson } from "@/data/mockLesson"

export default function DownLoadPdfButton() {
  // const lesson = useAppSelector(selectlesson)

  const handleClick = () => {
    buildPdf(mockLesson)
  }

  return <Button onClick={handleClick}>Télécharge la lesson</Button>
}

import { useSaveLessonMutation } from "@/store/api/lessonApi"
import { Button } from "../ui/button"
import { useAppSelector } from "@/store/hooks"
import { selectlesson } from "@/features/lesson/lessonSelectors"

export default function SendLessonToBackend() {
  const lesson = useAppSelector(selectlesson)
  const [saveLesson, { isLoading, error }] = useSaveLessonMutation()
  const handleClick = async () => {
    // Ajouter la sauvegarde de lesson à ce moment là
    await saveLesson(lesson)
  }
  return <Button onClick={handleClick}>Sauvegarder la lesson</Button>
}

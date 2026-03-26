import { usePostLessonMutation } from "@/store/api/lessonApi"
import { Button } from "../ui/button"
import { useAppSelector } from "@/store/hooks"
import { selectlesson } from "@/features/lesson/lessonSelectors"

export default function SendLessonToBackend() {
  const lesson = useAppSelector(selectlesson)
  const [postLesson, { isLoading, error }] = usePostLessonMutation()
  const handleClick = async () => {
    await postLesson(lesson)
    if (!error) {
      alert("Lesson Enregistrée")
    }
  }
  return (
    <>
      {!isLoading && !error && (
        <Button onClick={handleClick}>Sauvegarder la lesson</Button>
      )}
      {isLoading && <Button>Chargement...</Button>}
      {error && <div>Erreur d&apos;enregistrement</div>}
    </>
  )
}

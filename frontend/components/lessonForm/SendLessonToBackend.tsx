"use client"

import { usePostLessonMutation } from "@/store/api/lessonApi"
import { Button } from "../ui/button"
import { useAppSelector } from "@/store/hooks"
import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useRouter } from "next/navigation"

export default function SendLessonToBackend() {
  const router = useRouter()

  const lesson = useAppSelector(selectlesson)
  const [postLesson, { isLoading, error }] = usePostLessonMutation()
  const handleClick = async () => {
    const token = window.localStorage.getItem("token")
    if (!token) router.push("/login")
    await postLesson({ lesson, token: token as string })
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

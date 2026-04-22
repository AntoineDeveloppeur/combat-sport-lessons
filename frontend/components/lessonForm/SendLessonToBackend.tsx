"use client"

import { Button } from "../ui/button"
import { useAppSelector } from "@/store/hooks"
import { selectLessonForm } from "@/features/lessonForm/lessonFormSelectors"
import { useRouter } from "next/navigation"
import {
  usePostLessonMutation,
  useUpdateLessonMutation,
} from "@/store/api/lessonApi"

export default function SendLessonToBackend() {
  const router = useRouter()

  const lesson = useAppSelector(selectLessonForm)
  const [postLesson, { isLoading: isPosting, error: postError }] =
    usePostLessonMutation()
  const [updateLesson, { isLoading: isUpdating, error: updateError }] =
    useUpdateLessonMutation()

  const isLoading = isPosting || isUpdating
  const error = postError || updateError

  const handleClick = async () => {
    const token = window.localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      if (lesson.lessonId) {
        await updateLesson({
          lessonId: lesson.lessonId,
          lesson,
          token,
        }).unwrap()
        alert("Leçon mise à jour avec succès")
      } else {
        await postLesson({ lesson, token }).unwrap()
        alert("Leçon enregistrée avec succès")
      }
      router.push("/lessons/user")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { error?: string })?.error
          : undefined
      alert(errorMessage || "Erreur lors de la sauvegarde de la leçon")
    }
  }

  return (
    <>
      {!isLoading && (
        <Button onClick={handleClick}>Sauvegarder la leçon</Button>
      )}
      {isLoading && <Button disabled>Chargement...</Button>}
      {error && <div>{error.data?.error}</div>}
    </>
  )
}

import { Button } from "../ui/button"
import { useState, useEffect } from "react"
import { useGetLessonQuery } from "@/store/api/lessonApi"
import { useAppDispatch } from "@/store/hooks"
import { save } from "@/features/lesson/lessonSlice"
export default function FetchLessonFromBackend() {
  const [shouldFetch, setShouldFetch] = useState(false)
  const dispatch = useAppDispatch()

  const { data, isLoading, error } = useGetLessonQuery(1, {
    skip: !shouldFetch,
  })

  const handleClick = () => {
    setShouldFetch(true)
  }

  // Save in lesson state if data from backend is fetch
  // This will update UI with fetch informations
  useEffect(() => {
    if (data?.lesson) {
      dispatch(save(data.lesson))
    }
  }, [data, isLoading, error])

  return (
    <div>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Chargement..." : "Récupérer la lesson"}
      </Button>
      {data?.lesson && <p>Leçon récupérée : {data.lesson.title}</p>}
      {error && <p>Erreur : {error.message}</p>}
    </div>
  )
}

import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { Lesson } from "@/types"
import { UseFormHandleSubmit } from "react-hook-form"

interface UseSaveAndNavigateReturn {
  saveAndNavigate: (route?: string) => void
}

export function useSaveAndNavigate(
  handleSubmit: UseFormHandleSubmit<T>,
  setLesson: Dispatch<SetStateAction<Lesson>>
): UseSaveAndNavigateReturn {
  const Router = useRouter()

  const saveAndNavigate = (route?: string) => {
    handleSubmit((data) => {
      setLesson((prev) => ({ ...prev, ...data }))
      if (route) Router.push(route)
    })()
  }

  return { saveAndNavigate }
}

import { useRouter } from "next/navigation"
import { UseFormHandleSubmit } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { Lesson } from "@/types"

interface UseSaveAndNavigateReturn {
  saveAndNavigate: (data: object, route?: string) => void
}

export function useSaveAndNavigate(
  setLesson: Dispatch<SetStateAction<Lesson>>
): UseSaveAndNavigateReturn {
  const Router = useRouter()

  const saveAndNavigate = (data: object, route?: string) => {
    setLesson((prev) => ({ ...prev, ...data }))
    if (route) Router.push(route)
  }

  return { saveAndNavigate }
}

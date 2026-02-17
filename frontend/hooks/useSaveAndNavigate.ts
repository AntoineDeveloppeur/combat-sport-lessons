import { useRouter } from "next/navigation"
import { UseFormHandleSubmit } from "react-hook-form"
import { useAppDispatch } from "@/store/hooks"
import { save } from "@/features/lesson/lessonSlice"

interface UseSaveAndNavigateReturn {
  saveAndNavigate: (route?: string) => void
}

export function useSaveAndNavigate(
  handleSubmit: UseFormHandleSubmit<T>
): UseSaveAndNavigateReturn {
  const Router = useRouter()
  const dispatch = useAppDispatch()

  const saveAndNavigate = (route?: string) => {
    handleSubmit((data) => {
      dispatch(save(data))
      if (route) Router.push(route)
    })()
  }

  return { saveAndNavigate }
}

"use client"

import { Button } from "@/components/ui/button"
import { save } from "@/features/lesson/lessonSlice"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"
import { UseFormHandleSubmit, FieldValues } from "react-hook-form"
import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"

interface FormSaveAndNavigateProps {
  handleSubmit: UseFormHandleSubmit<FieldValues>
  prev?: string
  next?: string
}

export default function FormSaveAndNavigate({
  handleSubmit,
  prev,
  next,
}: FormSaveAndNavigateProps) {
  const Router = useRouter()
  const dispatch = useAppDispatch()
  const lesson = useAppSelector(selectlesson)

  const handleClick = async (route?: string) => {
    const success = await validateFormAndSaveToLesson()
    if (success && route) Router.push(route)
  }

  const validateFormAndSaveToLesson = async (): Promise<boolean> => {
    let success = false
    // handleSubmit first callback function is called if validation is a success
    await handleSubmit((data) => {
      dispatch(save(data))
      success = true
      console.log("lesson", lesson)
    })()
    return success
  }

  return (
    <div className="flex justify-between w-full">
      {prev && (
        <Button type="button" onClick={async () => await handleClick(prev)}>
          {"<"} Prev
        </Button>
      )}
      {next && (
        <Button type="button" onClick={async () => await handleClick(next)}>
          {">"} Next
        </Button>
      )}
    </div>
  )
}

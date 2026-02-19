import { useForm, FieldErrors, FieldArrayWithId } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { getYupValidationSchema } from "@/utils/getInstructionYupValidationSchema"
import { useInstructionFieldArray } from "./useInstructionFieldArray"
import { useSaveAndNavigate } from "./useSaveAndNavigate"
import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import type { LessonInstructionKey } from "@/types"

interface UseInstructionFormConfig {
  fieldName: LessonInstructionKey
}

interface UseInstructionReturn {
  handleSubmit: UseFormHandleSubmit<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  fields: FieldArrayWithId<T, string, "id">[]
  addInstruction: () => void
  saveAndNavigate: (route: string) => void
}

export function useInstructionForm({
  fieldName,
}: UseInstructionFormConfig): UseInstructionReturn {
  const validationSchema = getYupValidationSchema(fieldName)
  type FormData = Yup.InferType<typeof validationSchema>

  const lesson = useAppSelector(selectlesson)

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    defaultValues: lesson,
    resolver: yupResolver(validationSchema),
  })

  const { addInstruction, fields } = useInstructionFieldArray(
    lesson,
    fieldName,
    control
  )

  const { saveAndNavigate } = useSaveAndNavigate(handleSubmit)

  return {
    handleSubmit,
    register,
    errors,
    fields,
    addInstruction,
    saveAndNavigate,
  }
}

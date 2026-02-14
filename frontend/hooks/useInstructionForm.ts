import { useForm, FieldErrors, FieldArrayWithId } from "react-hook-form"
import { useContext } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { LessonContext } from "@/app/provider"
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { getYupValidationSchema } from "@/utils/getInstructionYupValidationSchema"
import { getInstructionDefaultValue } from "@/utils/getInstructionDefaultValue"
import { useInstructionFieldArray } from "./useInstructionFieldArray"
import { useSaveAndNavigate } from "./useSaveAndNavigate"

interface UseInstructionFormConfig {
  fieldName: "warmUpInstructions" | "bodyInstructions" | "coolDownInstructions"
}

interface UseInstructionReturn {
  handleSubmit: UseFormHandleSubmit<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  fields: FieldArrayWithId<T, string, "id">[]
  addInstruction: () => void
  handleSaveAndNavigate: (route: string) => void
}

export function useInstructionForm({
  fieldName,
}: UseInstructionFormConfig): UseInstructionReturn {
  const [lesson, setLesson] = useContext(LessonContext)!

  const validationSchema = getYupValidationSchema(fieldName)
  type FormData = Yup.InferType<typeof validationSchema>
  const defaultValues = getInstructionDefaultValue(
    lesson,
    fieldName
  ) as FormData

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  })

  const { addInstruction, fields } = useInstructionFieldArray(
    lesson,
    fieldName,
    control
  )

  const { saveAndNavigate } = useSaveAndNavigate(setLesson)
  const handleSaveAndNavigate = (route?: string) =>
    handleSubmit((data) => saveAndNavigate(data, route))()

  return {
    handleSubmit,
    register,
    errors,
    fields,
    addInstruction,
    handleSaveAndNavigate,
  }
}

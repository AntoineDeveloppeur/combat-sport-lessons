import { useForm, FieldErrors, FieldArrayWithId } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormGetValues,
} from "react-hook-form"
import { getYupValidationSchema } from "@/utils/getInstructionYupValidationSchema"
import { useInstructionFieldArray } from "./useInstructionFieldArray"
import { selectLessonForm } from "@/features/lessonForm/lessonFormSelectors"
import { useAppSelector } from "@/store/hooks"
import type { LessonInstructionKey } from "@/types"

interface UseInstructionFormConfig {
  fieldName: LessonInstructionKey
}

interface UseInstructionReturn {
  handleSubmit: UseFormHandleSubmit<any>
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  fields: FieldArrayWithId<any, string, "id">[]
  addInstruction: () => void
  removeLastInstruction: () => void
  getValues: UseFormGetValues<any>
  control: any
}

export function useInstructionForm({
  fieldName,
}: UseInstructionFormConfig): UseInstructionReturn {
  const validationSchema = getYupValidationSchema(fieldName)
  type FormData = Yup.InferType<typeof validationSchema>

  const lesson = useAppSelector(selectLessonForm)

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    getValues,
  } = useForm<FormData>({
    defaultValues: structuredClone(lesson),
    resolver: yupResolver(validationSchema),
  })

  const { addInstruction, removeLastInstruction, fields } =
    useInstructionFieldArray(lesson, fieldName, control)

  return {
    handleSubmit,
    register,
    errors,
    fields,
    addInstruction,
    removeLastInstruction,
    control,
    getValues,
  }
}

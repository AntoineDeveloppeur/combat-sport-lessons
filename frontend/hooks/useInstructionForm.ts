// hooks/useInstructionForm.ts
import {
  useForm,
  useFieldArray,
  FieldErrors,
  FieldArrayWithId,
} from "react-hook-form"
import { useState, useEffect, useContext } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { LessonContext } from "@/app/provider"
import { useRouter } from "next/navigation"
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form"

interface UseInstructionFormConfig {
  fieldName: "warmUpInstructions" | "bodyInstructions" | "coolDownInstructions"
  routes: {
    previousRoute?: string
    nextRoute?: string
  }
}

interface UseInstructionReturn {
  handleSubmit: UseFormHandleSubmit<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  fields: FieldArrayWithId<T, string, "id">[]
  addInstruction: () => void
  saveData: (data: object) => void
  handlePrevious: () => void
}

export function useInstructionForm({
  fieldName,
  routes,
}: UseInstructionFormConfig): UseInstructionReturn {
  const { previousRoute, nextRoute } = routes
  const [lesson, setLesson] = useContext(LessonContext)!
  const Router = useRouter()

  const [instructionCount, setInstructionCount] = useState<number>(
    lesson[fieldName]?.length || 1
  )

  // Validation schema (identique pour tous)
  const validationSchema = Yup.object().shape({
    [fieldName]: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string()
            .min(3, "L'instruction doit contenir au moins 3 caractères")
            .max(2000, "L'instruction ne peut pas dépasser 2000 caractères")
            .required("L'instruction est requise"),
          min: Yup.number()
            .min(0, "Les minutes doivent être au minimum 0")
            .max(90, "Les minutes ne peuvent pas dépasser 90")
            .required("Les minutes sont requises"),
          sec: Yup.number()
            .min(0, "Les secondes doivent être au minimum 0")
            .max(59, "Les secondes ne peuvent pas dépasser 59")
            .required("Les secondes sont requises"),
        })
      )
      .required(),
  })

  type FormData = Yup.InferType<typeof validationSchema>

  const defaultValues = lesson[fieldName]
    ? lesson
    : ({
        [fieldName]: [{ text: "", min: 1, sec: 0 }],
      } as FormData)

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  })

  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  })

  const addInstruction = () => {
    setInstructionCount((prev) => prev + 1)
  }

  useEffect(() => {
    const newVal = instructionCount
    const oldVal = fields.length
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ text: "", min: 1, sec: 0 })
      }
    } else {
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1)
      }
    }
  }, [instructionCount, append, remove, fields.length])

  const handlePrevious = () => {
    handleSubmit((data) => {
      setLesson((prev) => ({ ...prev, ...data }))
      console.log("lesson", lesson)
      if (previousRoute) Router.push(previousRoute)
    })()
  }
  const saveData = (data: object) => {
    setLesson((prev) => ({ ...prev, ...data }))
    console.log("lesson", lesson)
    if (nextRoute) Router.push(nextRoute)
  }

  return {
    handleSubmit,
    register,
    errors,
    fields,
    addInstruction,
    saveData,
    handlePrevious,
  }
}

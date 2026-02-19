"use client"

import { FieldLegend } from "@/components/ui/field"
import Select from "@/components/Select"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { Lesson } from "@/types"
import FormSaveAndNavigate from "./FormSaveAndNavigate"

interface PresetInstructionsProps {
  legend: string
  lessonKey: keyof Lesson
  placeholder: string
  selectOptions: string[]
  defaultValues: Lesson
}

export default function PresetInstructions({
  legend,
  lessonKey,
  placeholder,
  selectOptions,
  defaultValues,
}: PresetInstructionsProps) {
  const validationSchema = Yup.object().shape({
    [lessonKey]: Yup.string()
      .oneOf(selectOptions, "Veuillez choisir dans la liste")
      .required("Veuillez choisir l'échauffement"),
  })
  type FormData = Yup.InferType<typeof validationSchema>
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: defaultValues as FormData,
    resolver: yupResolver(validationSchema),
  })

  return (
    <>
      <FieldLegend className="mb-4 text-lg font-semibold">{legend}</FieldLegend>
      <Select
        lessonKey={lessonKey}
        placeholder={placeholder}
        selectOptions={selectOptions}
        register={register}
        errors={errors}
      />
      <FormSaveAndNavigate
        handleSubmit={handleSubmit}
        prev="/form/general"
        next="/form/corps"
      />
    </>
  )
}

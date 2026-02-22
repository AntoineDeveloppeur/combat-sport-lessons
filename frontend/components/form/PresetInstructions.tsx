"use client"

import { FieldLegend } from "@/components/ui/field"
import SelectField from "@/components/form/SelectField"
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
  prev?: string
  next?: string
}

export default function PresetInstructions({
  legend,
  lessonKey,
  placeholder,
  selectOptions,
  defaultValues,
  prev,
  next,
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
      <SelectField
        lessonKey={lessonKey}
        placeholder={placeholder}
        selectOptions={selectOptions}
        register={register}
        errors={errors}
      />
      <FormSaveAndNavigate
        handleSubmit={handleSubmit}
        prev={prev}
        next={next}
      />
    </>
  )
}

"use client"

import { FieldLegend } from "@/components/ui/field"
import SelectField from "@/components/form/SelectField"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { Lesson } from "@/types"
import FormSaveAndNavigate from "./FormSaveAndNavigate"
import { useAppSelector } from "@/store/hooks"
import { selectlesson } from "@/features/lesson/lessonSelectors"

interface PresetInstructionsProps {
  legend: string
  presetType: keyof Lesson
  placeholder: string
  selectOptions: string[]
  prev?: string
  next?: string
}

export default function PresetInstructions({
  legend,
  presetType,
  placeholder,
  selectOptions,
  prev,
  next,
}: PresetInstructionsProps) {
  const lesson = useAppSelector(selectlesson)

  const validationSchema = Yup.object().shape({
    [presetType]: Yup.string()
      .oneOf(selectOptions, "Veuillez choisir dans la liste")
      .required("Veuillez choisir l'échauffement"),
  })
  type FormData = Yup.InferType<typeof validationSchema>
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: lesson as FormData,
    resolver: yupResolver(validationSchema),
  })

  return (
    <>
      <FieldLegend className="mb-4 text-lg font-semibold">{legend}</FieldLegend>
      <SelectField
        presetType={presetType}
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

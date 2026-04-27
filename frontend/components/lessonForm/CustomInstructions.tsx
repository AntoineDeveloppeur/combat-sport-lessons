"use client"

import { FieldLegend } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import InstructionField from "@/components/lessonForm/InstructionField"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import type { LessonInstructionKey, Lesson } from "@/types"
import FormSaveAndNavigate from "./FormSaveAndNavigate"
import { useEffect } from "react"

interface CustomInstructionsProps {
  legend: string
  presetType: LessonInstructionKey
  prev?: string
  next?: string
  onGetValues?: (getValuesFn: () => Lesson) => void
}

export default function CustomInstructions({
  legend,
  presetType,
  prev,
  next,
  onGetValues,
}: CustomInstructionsProps) {
  const {
    register,
    errors,
    fields,
    addInstruction,
    removeLastInstruction,
    handleSubmit,
    getValues,
    control,
  } = useInstructionForm({
    fieldName: presetType,
  })

  useEffect(() => {
    if (onGetValues) {
      onGetValues(getValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues])

  return (
    <>
      <FieldLegend className="mb-4 text-lg font-semibold">{legend}</FieldLegend>
      {fields.map((_field, index) => (
        <InstructionField
          step={presetType}
          id={index}
          key={index}
          errors={errors}
          register={register}
          getValues={getValues}
          control={control}
        />
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => removeLastInstruction()}
      >
        {" "}
        Supprimer le dernier champs
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => addInstruction()}
      >
        {" "}
        Ajouter un champs
      </Button>
      <FormSaveAndNavigate
        handleSubmit={handleSubmit}
        prev={prev}
        next={next}
      />
    </>
  )
}

"use client"

import { FieldLegend } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import InstructionField from "@/components/form/InstructionField"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import type { LessonInstructionKey } from "@/types"
import FormSaveAndNavigate from "./FormSaveAndNavigate"

interface CustomInstructionsProps {
  legend: string
  presetType: LessonInstructionKey
  prev?: string
  next?: string
}

export default function CustomInstructions({
  legend,
  presetType,
  prev,
  next,
}: CustomInstructionsProps) {
  const { register, errors, fields, addInstruction, handleSubmit } =
    useInstructionForm({
      fieldName: presetType,
    })

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
        ></InstructionField>
      ))}
      <Button type="button" onClick={() => addInstruction()}>
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

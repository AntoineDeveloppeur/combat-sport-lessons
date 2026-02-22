"use client"

import { FieldLegend } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import type { LessonInstructionKey } from "@/types"
import FormSaveAndNavigate from "./FormSaveAndNavigate"

interface CustomInstructionsProps {
  legend: string
  lessonKey: LessonInstructionKey
  prev?: string
  next?: string
}

export default function CustomInstructions({
  legend,
  lessonKey,
  prev,
  next,
}: CustomInstructionsProps) {
  const { register, errors, fields, addInstruction, handleSubmit } =
    useInstructionForm({
      fieldName: lessonKey,
    })

  return (
    <>
      <FieldLegend className="mb-4 text-lg font-semibold">{legend}</FieldLegend>
      {fields.map((_field, index) => (
        <Instruction
          step={lessonKey}
          id={index}
          key={index}
          errors={errors}
          register={register}
        ></Instruction>
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

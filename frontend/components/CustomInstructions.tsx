"use client"

import { FieldLegend } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import type { InstructionFamily } from "@/types"

interface CustomInstructionsProps {
  legend: string
  lessonKey: InstructionFamily
}

export default function CustomInstructions({
  legend,
  lessonKey,
}: CustomInstructionsProps) {
  const { register, errors, fields, addInstruction } = useInstructionForm({
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
    </>
  )
}

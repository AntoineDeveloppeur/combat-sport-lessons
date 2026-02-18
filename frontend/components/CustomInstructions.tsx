"use client"

import { FieldLegend } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"

export default function CustomInstructions() {
  const { register, errors, fields, addInstruction } = useInstructionForm({
    fieldName: "warmUpInstructions",
  })

  return (
    <>
      <FieldLegend className="mb-4 text-lg font-semibold">
        Échauffement, écriver une suite d&apos;instruction composés de texte et
        d&apos;une durée. Vous pouvez ajoutez autant d&apos;instructions que
        vous pouvez. Ajoutez une instruction avec le boutton &quot;ajouter une
        instruction&quot;
      </FieldLegend>
      {fields.map((_field, index) => (
        <Instruction
          step="warmUpInstructions"
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

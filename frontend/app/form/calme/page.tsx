"use client"

import { Button } from "@/components/ui/button"
import { Form } from "../../../components/Form"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Instruction } from "@/components/Instruction"

export default function Confirm() {
  const { register, errors, fields, addInstruction, handleSaveAndNavigate } =
    useInstructionForm({
      fieldName: "coolDownInstructions",
    })

  return (
    <Form>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <FieldLegend className="mb-4 text-lg font-semibold">
          Retour au calme
        </FieldLegend>
        {fields.map((_field, index) => (
          <Instruction
            step="coolDownInstructions"
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
        <div className="flex justify-between w-full">
          <Button
            type="button"
            onClick={() => handleSaveAndNavigate("/form/corps")}
          >
            {"<"} Previous
          </Button>

          <Button type="button" onClick={() => handleSaveAndNavigate()}>
            {">"} Next
          </Button>
        </div>
      </FieldSet>
    </Form>
  )
}

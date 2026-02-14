"use client"

import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Button } from "@/components/ui/button"

import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"

export default function Body() {
  const { register, errors, fields, addInstruction, handleSaveAndNavigate } =
    useInstructionForm({
      fieldName: "bodyInstructions",
    })

  return (
    <Form>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <FieldLegend className="mb-4 text-lg font-semibold">
          Corps de séance
        </FieldLegend>
        {fields.map((_field, index) => (
          <Instruction
            step="bodyInstructions"
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
            onClick={() => handleSaveAndNavigate("/form/echauffement")}
          >
            {">"} Previous
          </Button>
          <Button
            type="button"
            onClick={() => handleSaveAndNavigate("/form/calme")}
          >
            {">"} Next
          </Button>{" "}
        </div>
      </FieldSet>
    </Form>
  )
}

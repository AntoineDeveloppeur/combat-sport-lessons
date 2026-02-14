"use client"

import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Button } from "@/components/ui/button"

import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"

export default function WarmUp() {
  const {
    handleSubmit,
    register,
    errors,
    fields,
    addInstruction,
    saveData,
    handlePrevious,
  } = useInstructionForm({
    fieldName: "warmUpInstructions",
    routes: {
      previousRoute: "/form/general",
      nextRoute: "/form/corps",
    },
  })

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <FieldLegend className="mb-4 text-lg font-semibold">
          Échauffement, écriver une suite d&apos;instruction composés de texte
          et d&apos;une durée. Vous pouvez ajoutez autant d&apos;instructions
          que vous pouvez. Ajoutez une instruction avec le boutton &quot;ajouter
          une instruction&quot;
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
        <div className="flex justify-between w-full">
          <Button type="button" onClick={handlePrevious}>
            {"<"} Previous
          </Button>

          <Button>{">"} Next</Button>
        </div>
      </FieldSet>
    </Form>
  )
}

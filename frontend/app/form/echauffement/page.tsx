"use client"

import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "@/components/Form"
import { Button } from "@/components/ui/button"
import { warmUpPresetTitles } from "@/data/warmUpPreset"
import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import { useContext } from "react"
import { LessonContext } from "@/app/provider"
import Select from "@/components/Select"

export default function WarmUp() {
  const [lesson] = useContext(LessonContext)!

  const warmUpType = lesson.warmUp === "preset" ? "preset" : "custom"

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
        {warmUpType === "custom" && (
          <>
            <FieldLegend className="mb-4 text-lg font-semibold">
              Échauffement, écriver une suite d&apos;instruction composés de
              texte et d&apos;une durée. Vous pouvez ajoutez autant
              d&apos;instructions que vous pouvez. Ajoutez une instruction avec
              le boutton &quot;ajouter une instruction&quot;
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
          </>
        )}
        {warmUpType === "preset" && (
          <>
            <FieldLegend className="mb-4 text-lg font-semibold">
              Trouvez l&apos;échauffement qui est le plus adaptée à votre corps
              de séance
            </FieldLegend>
            <Select
              lessonKey="warmUpPresetTitle"
              placeholder="Sélectionne un échauffement prédéfinis"
              selectOptions={warmUpPresetTitles}
              register={register}
              errors={errors}
            />
          </>
        )}
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

"use client"

import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "@/components/Form"
import { Button } from "@/components/ui/button"
import { warmUpPresetTitles } from "@/data/warmUpPreset"
import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import Select from "@/components/Select"
import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"

export default function WarmUp() {
  const lesson = useAppSelector(selectlesson)
  const warmUpType = lesson.warmUp === "preset" ? "preset" : "custom"

  const { register, errors, fields, addInstruction, saveAndNavigate } =
    useInstructionForm({
      fieldName: "warmUpInstructions",
    })

  return (
    <Form>
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
            <Button type="button" onClick={() => addInstruction()}>
              {" "}
              Ajouter un champs
            </Button>
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

        <div className="flex justify-between w-full">
          <Button
            type="button"
            onClick={() => saveAndNavigate("/form/general")}
          >
            {">"} Next
          </Button>
          <Button type="button" onClick={() => saveAndNavigate("/form/corps")}>
            {">"} Next
          </Button>
        </div>
      </FieldSet>
    </Form>
  )
}

"use client"

import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "@/components/Form"
import { Button } from "@/components/ui/button"
import { warmUpPresetTitles } from "@/data/warmUpPreset"
import { Instruction } from "@/components/Instruction"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import PresetInstructions from "@/components/PresetInstructions"
import CustomInstructions from "@/components/CustomInstructions"

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
          <CustomInstructions
            legend="Échauffement, écriver une suite d'instruction composés de texte et
        d'une durée. Vous pouvez ajoutez autant d'instructions que
        vous pouvez. Ajoutez une instruction avec le boutton &quot;ajouter une
        instruction&quot;"
            lessonKey="warmUpInstructions"
          />
        )}
        {warmUpType === "preset" && (
          <PresetInstructions
            legend="Trouvez l'échauffement qui est le plus adaptée à votre corps de séance"
            lessonKey="warmUpInstructions"
            placeholder="Sélectionne un échauffement prédéfinis"
            selectOptions={warmUpPresetTitles}
            defaultValues={lesson}
          />
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

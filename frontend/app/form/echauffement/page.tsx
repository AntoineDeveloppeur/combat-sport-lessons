"use client"

import { FieldSet } from "@/components/ui/field"
import { Form } from "@/components/form/Form"
import { warmUpPresetTitles } from "@/data/warmUpPreset"
import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import PresetInstructions from "@/components/form/PresetInstructions"
import CustomInstructions from "@/components/form/CustomInstructions"

export default function WarmUp() {
  const lesson = useAppSelector(selectlesson)
  const warmUpType = lesson.warmUp === "preset" ? "preset" : "custom"
  const prevPage = "/form/general"
  const nextPage = "/form/corps"

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
            prev={prevPage}
            next={nextPage}
          />
        )}
        {warmUpType === "preset" && (
          <PresetInstructions
            legend="Trouvez l'échauffement qui est le plus adaptée à votre corps de séance"
            lessonKey="warmUpPresetTitle"
            placeholder="Sélectionne un échauffement prédéfinis"
            selectOptions={warmUpPresetTitles}
            defaultValues={lesson}
            prev={prevPage}
            next={nextPage}
          />
        )}
      </FieldSet>
    </Form>
  )
}

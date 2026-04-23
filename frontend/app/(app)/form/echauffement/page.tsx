"use client"

import { FieldSet } from "@/components/ui/field"
import { Form } from "@/components/lessonForm/Form"
import { warmUpPresetTitles } from "@/data/warmUpPreset"
import { selectLessonForm } from "@/features/lessonForm/lessonFormSelectors"
import { useAppSelector } from "@/store/hooks"
import PresetInstructions from "@/components/lessonForm/PresetInstructions"
import CustomInstructions from "@/components/lessonForm/CustomInstructions"

export default function WarmUp() {
  const lesson = useAppSelector(selectLessonForm)
  const warmUpType = lesson.warmUp === "preset" ? "preset" : "custom"
  const prevPage = "/form/general"
  const nextPage = "/form/corps"

  return (
    <Form>
      <FieldSet className="flex flex-col items-start w-[600px]">
        {warmUpType === "custom" && (
          <CustomInstructions
            legend="L’échauffement permet d’augmenter progressivement le rythme cardiaque, de chauffer les muscles, de lubrifier les articulations, de préparer le système nerveux et d’améliorer la concentration.
Pour en tirer tous les bénéfices, il est recommandé d’y consacrer au minimum 15 minutes."
            presetType="warmUpInstructions"
            prev={prevPage}
            next={nextPage}
          />
        )}
        {warmUpType === "preset" && (
          <PresetInstructions
            legend="Trouvez l'échauffement qui est le plus adaptée à votre corps de séance"
            presetType="warmUpPresetTitle"
            placeholder="Sélectionne un échauffement prédéfinis"
            selectOptions={warmUpPresetTitles}
            prev={prevPage}
            next={nextPage}
          />
        )}
      </FieldSet>
    </Form>
  )
}

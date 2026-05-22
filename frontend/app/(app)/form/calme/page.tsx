"use client"

import { FieldSet } from "@/components/ui/field"
import { Form } from "@/components/lessonForm/Form"
import { coolDownPresetTitles } from "@/data/coolDownPreset"
import { selectLessonForm } from "@/features/lessonForm/lessonFormSelectors"
import { useAppSelector } from "@/store/hooks"
import PresetInstructions from "@/components/lessonForm/PresetInstructions"
import CustomInstructions from "@/components/lessonForm/CustomInstructions"
import DownLoadPdfButton from "@/components/lessonForm/DownLoadPdfButton"
import SendLessonToBackend from "@/components/lessonForm/SendLessonToBackend"
import { useState } from "react"
import type { Lesson } from "@/types"

export default function Confirm() {
  const lesson = useAppSelector(selectLessonForm)
  const coolDownType = lesson.coolDown === "preset" ? "preset" : "custom"
  const prevPage = "/form/corps"
  const [getFormValues, setGetFormValues] = useState<(() => Lesson) | null>(
    null
  )

  return (
    <>
      <Form>
        <FieldSet className="flex flex-col items-start w-[600px]">
          {coolDownType === "custom" && (
            <CustomInstructions
              legend="Récupération et étirements : aide le corps à revenir au calme et favorise la récupération."
              presetType="coolDownInstructions"
              prev={prevPage}
              onGetValues={(fn) => setGetFormValues(() => fn)}
            />
          )}
          {coolDownType === "preset" && (
            <PresetInstructions
              legend="Trouvez le retour au calme qui est le plus adapté à votre séance"
              presetType="coolDownPresetTitle"
              placeholder="Sélectionne un retour au calme prédéfinis"
              selectOptions={coolDownPresetTitles}
              prev={prevPage}
            />
          )}
        </FieldSet>
      </Form>
      <div className="flex justify-end gap-4 w-full">
        {getFormValues && <DownLoadPdfButton getFormValues={getFormValues} />}
        <SendLessonToBackend />
      </div>
    </>
  )
}

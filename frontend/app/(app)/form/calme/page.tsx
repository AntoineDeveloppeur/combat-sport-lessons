"use client"

import { FieldSet } from "@/components/ui/field"
import { Form } from "@/components/lessonForm/Form"

import { coolDownPresetTitles } from "@/data/coolDownPreset"

import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import PresetInstructions from "@/components/lessonForm/PresetInstructions"
import CustomInstructions from "@/components/lessonForm/CustomInstructions"
import DownLoadPdfButton from "@/components/lessonForm/DownLoadPdfButton"
import SendLessonToBackend from "@/components/lessonForm/SendLessonToBackend"
import FetchLessonFromBackend from "@/components/lessonForm/FetchLessonFromBackend"

export default function Confirm() {
  const lesson = useAppSelector(selectlesson)
  const coolDownType = lesson.coolDown === "preset" ? "preset" : "custom"
  const prevPage = "/form/corps"
  const nextPage = "/form/calme"

  return (
    <>
      <Form>
        <FieldSet className="flex flex-col items-start w-[600px]">
          {coolDownType === "custom" && (
            <CustomInstructions
              legend="Retour au calme, écriver une suite d'instruction composés de texte et
        d'une durée. Vous pouvez ajoutez autant d'instructions que
        vous pouvez. Ajoutez une instruction avec le boutton &quot;ajouter une
        instruction&quot;"
              presetType="coolDownInstructions"
              prev={prevPage}
              next={nextPage}
            />
          )}
          {coolDownType === "preset" && (
            <PresetInstructions
              legend="Trouvez le retour au calme qui est le plus adapté à votre séance"
              presetType="coolDownPresetTitle"
              placeholder="Sélectionne un retour au calme prédéfinis"
              selectOptions={coolDownPresetTitles}
              prev={prevPage}
              next={nextPage}
            />
          )}
        </FieldSet>
      </Form>
      <DownLoadPdfButton />
      <SendLessonToBackend />
      <FetchLessonFromBackend />
    </>
  )
}

"use client"

import { FieldSet } from "@/components/ui/field"
import { Form } from "@/components/lessonForm/Form"
import CustomInstructions from "@/components/lessonForm/CustomInstructions"

export default function Body() {
  return (
    <Form>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <CustomInstructions
          legend="Le corps de séance est le moment clé de ton entraînement : c’est ici que tu développes les techniques, la condition physique et les automatismes."
          presetType="bodyInstructions"
          prev="/form/echauffement"
          next="/form/calme"
        />
      </FieldSet>
    </Form>
  )
}

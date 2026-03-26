"use client"

import { FieldSet } from "@/components/ui/field"
import { Form } from "@/components/lessonForm/Form"
import CustomInstructions from "@/components/lessonForm/CustomInstructions"

export default function Body() {
  return (
    <Form>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <CustomInstructions
          legend="Corps de séance"
          presetType="bodyInstructions"
          prev="/form/echauffement"
          next="/form/calme"
        />
      </FieldSet>
    </Form>
  )
}

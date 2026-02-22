"use client"

import { FieldSet } from "@/components/ui/field"
import { Form } from "@/components/Form"
import CustomInstructions from "@/components/CustomInstructions"

export default function Body() {
  return (
    <Form>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <CustomInstructions
          legend="Corps de séance"
          lessonKey="bodyInstructions"
          prev="/form/echauffement"
          next="/form/calme"
        />
      </FieldSet>
    </Form>
  )
}

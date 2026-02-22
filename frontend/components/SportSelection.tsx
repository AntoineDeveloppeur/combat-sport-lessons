"use client"

import { Field, FieldError } from "@/components/ui/field"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { sportList } from "@/data/sportList"
import { UseFormRegister } from "react-hook-form"
import type { Lesson } from "@/types"
import { FieldErrors } from "react-hook-form"

interface SportSelectionProps {
  errors: FieldErrors<Lesson>
  register: UseFormRegister<Lesson>
}

export default function SportSelection({
  errors,
  register,
}: SportSelectionProps) {
  return (
    <Field>
      <NativeSelect {...register("sport")}>
        <NativeSelectOption value="">Sélectionne un sport</NativeSelectOption>
        {sportList.map((sport) => (
          <NativeSelectOption key={sport} value={sport}>
            {sport}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <FieldError>{errors?.sport?.message}</FieldError>
    </Field>
  )
}

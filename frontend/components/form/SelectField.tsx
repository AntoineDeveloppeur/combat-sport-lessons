"use client"

import { Field, FieldError } from "@/components/ui/field"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { type Lesson } from "@/types"

interface SelectProps {
  lessonKey: keyof Lesson
  placeholder: string
  selectOptions: string[]
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export default function SelectField({
  lessonKey,
  placeholder,
  selectOptions,
  register,
  errors,
}: SelectProps) {
  return (
    <Field>
      <NativeSelect {...register(lessonKey)}>
        <NativeSelectOption value="">{placeholder}</NativeSelectOption>
        {selectOptions.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {option}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <FieldError>{errors?.[lessonKey]?.message}</FieldError>
    </Field>
  )
}

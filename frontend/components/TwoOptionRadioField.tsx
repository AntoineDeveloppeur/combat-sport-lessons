"use client"

import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form"
import { type Lesson } from "@/types"

interface TwoOptionRadioFieldProps {
  name: "warmUp" | "coolDown"
  legend: string
  title1: string
  title2: string
  subtitle2: string
  watch: UseFormWatch<T>
  setValue: UseFormSetValue<T>
  errors: FieldErrors<Lesson>
}

export default function TwoOptionRadioField({
  name,
  legend,
  title1,
  title2,
  subtitle2,
  watch,
  setValue,
  errors,
}: TwoOptionRadioFieldProps) {
  const value = watch(name)

  return (
    <FieldSet className="flex flex-col items-start w-[600px]">
      <FieldLegend className="mb-4 text-lg font-semibold">{legend}</FieldLegend>
      <RadioGroup
        value={value}
        onValueChange={(value) => setValue(name, value as "custom" | "preset")}
        className="max-w-sm"
      >
        <FieldLabel htmlFor={`custom-${name}`}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>{title1}</FieldTitle>
            </FieldContent>
            <RadioGroupItem id={`custom-${name}`} value="custom" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor={`preset-${name}`}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>{title2}</FieldTitle>
              <FieldDescription>{subtitle2}</FieldDescription>
            </FieldContent>
            <RadioGroupItem id={`preset-${name}`} value="preset" />
          </Field>
        </FieldLabel>
        <FieldError>{errors?.[name]?.message}</FieldError>
      </RadioGroup>
    </FieldSet>
  )
}

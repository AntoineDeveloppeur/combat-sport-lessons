"use client"

import { UseFormRegister } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import type { Lesson } from "@/types"
import { FieldErrors } from "react-hook-form"
import { Input } from "../ui/input"

interface TitleFieldProps {
  errors: FieldErrors<Lesson>
  register: UseFormRegister<Lesson>
}

export default function TitleField({ errors, register }: TitleFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="title">Titre</FieldLabel>
      <Input
        id="title"
        {...register("title")}
        placeholder="Exemple : défense contre coups de pied médian"
      ></Input>
      <FieldError>{errors?.title?.message}</FieldError>
    </Field>
  )
}

"use client"

import { UseFormRegister } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { Lesson } from "@/types"
import { FieldErrors } from "react-hook-form"

interface ObjectiveProps {
  errors: FieldErrors<Lesson>
  register: UseFormRegister<Lesson>
}

export default function ObjectiveField({ errors, register }: ObjectiveProps) {
  return (
    <Field>
      <FieldLabel htmlFor="objective">Objectif de la séance</FieldLabel>
      <Textarea
        id="objective"
        {...register("objective")}
        placeholder="Exemple : la séance va permettre d'améliorer la technique du coups de pied bas pour un public débutant"
      ></Textarea>
      <FieldError>{errors?.objective?.message}</FieldError>
    </Field>
  )
}

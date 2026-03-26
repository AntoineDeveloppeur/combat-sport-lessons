/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

interface NameFieldProps {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
}

export function NameField({ register, errors }: NameFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="name">Nom ou pseudo</FieldLabel>
      <Input
        id="name"
        type="text"
        placeholder="Gérard Bouchard"
        {...register("name")}
      />
      <FieldError>{errors?.name?.message as string}</FieldError>
    </Field>
  )
}

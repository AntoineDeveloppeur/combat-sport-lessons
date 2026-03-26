/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

interface EmailFieldProps {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
}

export function EmailField({ register, errors }: EmailFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" {...register("email")} />
      <FieldError>{errors?.email?.message as string}</FieldError>
    </Field>
  )
}

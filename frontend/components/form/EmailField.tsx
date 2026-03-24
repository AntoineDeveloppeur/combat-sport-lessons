import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import type { Login } from "@/types"

interface EmailFieldProps {
  register: UseFormRegister<Login>
  errors: FieldErrors<Login>
}

export function EmailField({ register, errors }: EmailFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        id="email"
        type="email"
        {...register("email")}
      />
      <FieldError>{errors?.email?.message}</FieldError>
    </Field>
  )
}

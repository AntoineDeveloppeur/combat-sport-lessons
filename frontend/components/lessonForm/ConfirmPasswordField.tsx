/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

interface ConfirmPasswordFieldProps {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
}

export function ConfirmPasswordField({
  register,
  errors,
}: ConfirmPasswordFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="confirm-password">
        Confirmer le mot de passe
      </FieldLabel>
      <Input
        id="confirm-password"
        type="password"
        {...register("confirmPassword")}
      />
      <FieldError>{errors?.confirmPassword?.message as string}</FieldError>
    </Field>
  )
}

import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import type { Login } from "@/types"

interface PasswordFieldProps {
  register: UseFormRegister<Login>
  errors: FieldErrors<Login>
  showForgotPassword?: boolean
}

export function PasswordField({
  register,
  errors,
  showForgotPassword = false,
}: PasswordFieldProps) {
  return (
    <Field>
      <div className="flex items-center">
        <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
        {showForgotPassword && (
          <a
            href="#"
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
          >
            Mot de passe oublié ?
          </a>
        )}
      </div>
      <Input
        id="password"
        type="password"
        {...register("password")}
      />
      <FieldError>{errors?.password?.message}</FieldError>
    </Field>
  )
}

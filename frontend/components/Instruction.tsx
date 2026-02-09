import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Field, FieldTitle, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormState } from "@/types/index"

interface InstructionProps {
  id: number
  errors: FieldErrors<FormState>
  register: UseFormRegister<FormState>
}

export function Instruction({ id, errors, register }: InstructionProps) {
  return (
    <>
      <Field>
        <FieldTitle>Instruction n°{id + 1}</FieldTitle>
        <Textarea {...register(`warmUpInstructions.${id}.text`)} />
        <FieldError>
          {errors?.warmUpInstructions?.[id]?.text?.message}
        </FieldError>
      </Field>

      <Field orientation="horizontal" className="w-auto items-center gap-2">
        <Input
          {...register(`warmUpInstructions.${id}.min`)}
          className="text-center"
          type="number"
          min="0"
          max="60"
          step={1}
        />
        <span className="text-sm text-muted-foreground">min</span>

        <Input
          {...register(`warmUpInstructions.${id}.sec`)}
          className="text-center"
          type="number"
          min="0"
          max="55"
          step={5}
        />
        <span className="text-sm text-muted-foreground">sec</span>
      </Field>

      <FieldError>{errors?.warmUpInstructions?.[id]?.min?.message}</FieldError>
      <FieldError>{errors?.warmUpInstructions?.[id]?.sec?.message}</FieldError>
    </>
  )
}

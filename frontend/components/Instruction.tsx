import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Field, FieldTitle, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Lesson } from "@/types/index"

interface InstructionProps {
  step: "warmUpInstructions" | "bodyInstructions" | "coolDownInstructions"
  id: number
  errors: FieldErrors<Lesson>
  register: UseFormRegister<Lesson>
}

export function Instruction({ step, id, errors, register }: InstructionProps) {
  return (
    <>
      <Field>
        <FieldTitle>Instruction n°{id + 1}</FieldTitle>
        <Textarea {...register(`${step}.${id}.text`)} />
        <FieldError>{errors?.[step]?.[id]?.text?.message}</FieldError>
      </Field>

      <Field orientation="horizontal" className="w-auto items-center gap-2">
        <Input
          {...register(`${step}.${id}.min`)}
          className="text-center"
          type="number"
          min="0"
          max="60"
          step={1}
        />
        <span className="text-sm text-muted-foreground">min</span>

        <Input
          {...register(`${step}.${id}.sec`)}
          className="text-center"
          type="number"
          min="0"
          max="55"
          step={5}
        />
        <span className="text-sm text-muted-foreground">sec</span>
      </Field>

      <FieldError>{errors?.[step]?.[id]?.min?.message}</FieldError>
      <FieldError>{errors?.[step]?.[id]?.sec?.message}</FieldError>
    </>
  )
}

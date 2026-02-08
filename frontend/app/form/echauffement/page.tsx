"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import {
  Field,
  FieldSet,
  FieldLegend,
  FieldTitle,
  FieldError,
} from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"

export default function WarmUp() {
  const [state, setState] = useContext(AppStateContext)!
  const Router = useRouter()

  const validationSchema = Yup.object().shape({
    instruction1: Yup.string()
      .min(3, "L'instruction doit contenir au moins 3 caractères")
      .max(2000, "L'instruction ne peut pas dépasser 2000 caractères")
      .required("L'instruction est requise"),
    instruction1min: Yup.number()
      .min(0, "Les minutes doivent être au minimum 0")
      .max(90, "Les minutes ne peuvent pas dépasser 90")
      .required("Les minutes sont requises"),
    instruction1sec: Yup.number()
      .min(0, "Les secondes doivent être au minimum 0")
      .max(59, "Les secondes ne peuvent pas dépasser 59")
      .required("Les secondes sont requises"),
  })
  type GeneralFormData = Yup.InferType<typeof validationSchema>

  const defaultValues = {
    instruction1: state.instruction1 ?? "",
    instruction1min: state.instruction1min ?? 1,
    instruction1sec: state.instruction1sec ?? 0,
  } as GeneralFormData

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GeneralFormData>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  })
  const saveData = (data: object) => {
    setState((prev) => ({ ...prev, ...data }))
    Router.push("/form/about")
  }

  const handlePrevious = () => {
    handleSubmit((data) => {
      setState((prev) => ({ ...prev, ...data }))

      Router.push("/form/general")
    })()
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <FieldLegend className="mb-4 text-lg font-semibold">
          Échauffement, écriver une suite d&apos;instruction composés de texte
          et d&apos;une durée. Vous pouvez ajoutez autant d&apos;instructions
          que vous pouvez. Ajoutez une instruction avec le boutton &quot;ajouter
          une instruction&quot;
        </FieldLegend>
        <Field>
          <FieldTitle>Instructions n°1</FieldTitle>
          <Textarea {...register("instruction1")}></Textarea>
          <FieldError>{errors?.instruction1?.message}</FieldError>
        </Field>
        <Field orientation="horizontal" className="w-auto items-center  gap-2">
          {" "}
          <Input
            {...register("instruction1min")}
            className="text-center"
            type="number"
            min="0"
            max="60"
            step={1}
          />
          <span className="text-sm text-muted-foreground">min</span>
          <Input
            {...register("instruction1sec")}
            className="text-center"
            type="number"
            min="0"
            max="55"
            step={5}
          />
          <span className="text-sm text-muted-foreground">sec</span>
        </Field>
        <FieldError>{errors?.instruction1min?.message}</FieldError>
        <FieldError>{errors?.instruction1sec?.message}</FieldError>
        <div className="flex justify-between w-full">
          <Button type="button" onClick={handlePrevious}>
            {"<"} Previous
          </Button>

          <Button>{">"} Next</Button>
        </div>
      </FieldSet>
    </Form>
  )
}

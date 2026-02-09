"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../provider"
import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Button } from "@/components/ui/button"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { Instruction } from "@/components/Instruction"

export default function WarmUp() {
  const [state, setState] = useContext(AppStateContext)!
  const Router = useRouter()

  const validationSchema = Yup.object().shape({
    warmUpInstructions: Yup.array()
      .of(
        Yup.object().shape({
          text: Yup.string()
            .min(3, "L'instruction doit contenir au moins 3 caractères")
            .max(2000, "L'instruction ne peut pas dépasser 2000 caractères")
            .required("L'instruction est requise"),
          min: Yup.number()
            .min(0, "Les minutes doivent être au minimum 0")
            .max(90, "Les minutes ne peuvent pas dépasser 90")
            .required("Les minutes sont requises"),
          sec: Yup.number()
            .min(0, "Les secondes doivent être au minimum 0")
            .max(59, "Les secondes ne peuvent pas dépasser 59")
            .required("Les secondes sont requises"),
        })
      )
      .required(),
  })

  // Inferer le type est obligatoire car sinon les inputs du formulaire sont inférer comme possiblement undefined
  type GeneralFormData = Yup.InferType<typeof validationSchema>
  const defaultValues = {
    warmUpInstructions: [
      {
        text: state.warmUpInstructions?.[0]?.text ?? "",
        min: state.warmUpInstructions?.[0]?.min ?? 1,
        sec: state.warmUpInstructions?.[0]?.sec ?? 0,
      },
    ],
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
        <Instruction id={0} errors={errors} register={register}></Instruction>
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

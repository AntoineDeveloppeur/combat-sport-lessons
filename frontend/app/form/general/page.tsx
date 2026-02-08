"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldContent,
  FieldTitle,
  FieldDescription,
} from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { sportList } from "@/data/sportList"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"

export default function General() {
  const [state, setState] = useContext(AppStateContext)!
  const Router = useRouter()

  const validationSchema = Yup.object().shape({
    sport: Yup.string()
      .oneOf(sportList, "Veuillez choisir un sport dans la liste")
      .required("Veuillez choisir le sport"),
    objective: Yup.string()
      .min(20, "L'objectif doit contenir au moins 20 caractères")
      .max(500, "L'objectif ne peut pas dépasser 500 caractères")
      .required("Veuillez décrire l'objectif de la séance"),
    warmUp: Yup.string()
      .oneOf(
        ["custom", "preset"],
        "Veuillez choisir d'écrire vous même l'échauffement ou de sélectionner un échauffement tout fait"
      )
      .required(
        "Veuillez choisir d'écrire vous même l'échauffement ou de sélectionner un échauffement tout fait"
      ),
    coolDown: Yup.string()
      .oneOf(["custom", "preset"], "fdqsfdsq")
      .required("Veuillez choisir d'écrire vous même les étirements"),
  })

  // Inferer le type est obligatoire car sinon les inputs du formulaire sont inférer comme possiblement undefined
  type GeneralFormData = Yup.InferType<typeof validationSchema>
  const defaultValues = {
    ...state,
    warmUp: state.warmUp || "custom",
    coolDown: state.coolDown || "custom",
  } as GeneralFormData

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GeneralFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
    mode: "onSubmit",
  })

  const warmUpValue = watch("warmUp")
  const coolDownValue = watch("coolDown")

  const saveData = (data: object) => {
    setState((prev) => ({ ...prev, ...data }))
    console.log("state", state)
    Router.push("/form/echauffement")
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <FieldLegend className="mb-4 text-lg font-semibold">
          Général
        </FieldLegend>
        <Field>
          <NativeSelect {...register("sport")}>
            <NativeSelectOption value="">
              Sélectionne un sport
            </NativeSelectOption>
            {sportList.map((sport) => (
              <NativeSelectOption key={sport} value={sport}>
                {sport}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError>{errors?.sport?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Objectif de la séance</FieldLabel>
          <Textarea
            {...register("objective")}
            placeholder="Exemple : la séance va permettre d'améliorer la technique du coups de pied bas pour un public débutant"
          ></Textarea>
          <FieldError>{errors?.objective?.message}</FieldError>
        </Field>
        <FieldSet className="flex flex-col items-start w-[600px]">
          <FieldLegend className="mb-4 text-lg font-semibold">
            Pour l&apos;échauffement ?
          </FieldLegend>
          <RadioGroup
            value={warmUpValue}
            onValueChange={(value) =>
              setValue("warmUp", value as "custom" | "preset")
            }
            className="max-w-sm"
          >
            <FieldLabel htmlFor="custom-warm-up">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    J&apos;écris moi-même l&apos;échauffement
                  </FieldTitle>
                </FieldContent>
                <RadioGroupItem value="custom" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="preset-warm-up">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Je sélectionne un échauffement tout fait
                  </FieldTitle>
                  <FieldDescription>
                    la sélection sera proposée plus tard
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="preset" />
              </Field>
            </FieldLabel>
            <FieldError>{errors?.warmUp?.message}</FieldError>
          </RadioGroup>
        </FieldSet>
        <FieldSet className="flex flex-col items-start w-[600px]">
          <FieldLegend className="mb-4 text-lg font-semibold">
            Pour le retour au calme ou les étirements
          </FieldLegend>
          <RadioGroup
            value={coolDownValue}
            onValueChange={(value) =>
              setValue("coolDown", value as "custom" | "preset")
            }
            className="max-w-sm"
          >
            <FieldLabel htmlFor="preset-warm-up">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Je les écris moi-même</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="custom" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="preset-cool-down">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Je sélectionne une fin de séance toute faite
                  </FieldTitle>
                  <FieldDescription>
                    la sélection sera proposée plus tard
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="preset" />
              </Field>
            </FieldLabel>
          </RadioGroup>
          <FieldError>{errors?.coolDown?.message}</FieldError>
        </FieldSet>

        <Button>Next</Button>
      </FieldSet>
    </Form>
  )
}

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
import { sportList } from "@/app/data/sportList"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function General() {
  const [state, setState] = useContext(AppStateContext)!
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: state, mode: "onSubmit" })

  const Router = useRouter()
  const saveData = (data: object) => {
    setState((prev) => ({ ...prev, ...data }))
    Router.push("/form/education")
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <FieldLegend className="mb-4 text-lg font-semibold">
          Général
        </FieldLegend>
        <Field>
          <NativeSelect {...register("sport")}>
            <NativeSelectOption value="">Sélection un sport</NativeSelectOption>
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
        </Field>
        <FieldSet className="flex flex-col items-start w-[600px]">
          <FieldLegend className="mb-4 text-lg font-semibold">
            Pour l&apos;échauffement ?
          </FieldLegend>
          <RadioGroup defaultValue="custom-warm-up" className="max-w-sm">
            <FieldLabel htmlFor="custom-warm-up">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    J&apos;écris moi-même l&apos;échauffement
                  </FieldTitle>
                </FieldContent>
                <RadioGroupItem value="custom-warm-up" id="custom-warm-up" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="preset-warm-up">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Je sélectionne un échauffement tout fait
                  </FieldTitle>
                  <FieldDescription>
                    la sélection sera proposé plus tard
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="preset-warm-up" id="preset-warm-up" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
        <FieldSet className="flex flex-col items-start w-[600px]">
          <FieldLegend className="mb-4 text-lg font-semibold">
            Pour le retour au calme ou les étirements
          </FieldLegend>
          <RadioGroup defaultValue="preset-warm-up" className="max-w-sm">
            <FieldLabel htmlFor="preset-warm-up">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Je les écris moi-même</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="preset-warm-up" id="preset-warm-up" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="preset-cool-down">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    Je sélectionne une fin de séance toute faite
                  </FieldTitle>
                  <FieldDescription>
                    la sélection sera proposé plus tard
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value="preset-cool-down"
                  id="preset-cool-down"
                />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>

        <Button>Next</Button>
      </FieldSet>
    </Form>
  )
}

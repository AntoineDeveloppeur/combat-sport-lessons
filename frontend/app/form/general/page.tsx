"use client"

import { useForm } from "react-hook-form"
import { useContext } from "react"
import { LessonContext } from "../../provider"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Button } from "@/components/ui/button"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { sportList } from "@/data/sportList"
import { Textarea } from "@/components/ui/textarea"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import TwoOptionRadioField from "@/components/TwoOptionRadioField"
import { useSaveAndNavigate } from "@/hooks/useSaveAndNavigate"

export default function General() {
  const [lesson, setLesson] = useContext(LessonContext)!

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
    ...lesson,
    warmUp: lesson.warmUp || "custom",
    coolDown: lesson.coolDown || "custom",
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

  const { saveAndNavigate } = useSaveAndNavigate(handleSubmit, setLesson)

  return (
    <Form>
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
          <FieldLabel htmlFor="objective">Objectif de la séance</FieldLabel>
          <Textarea
            id="objective"
            {...register("objective")}
            placeholder="Exemple : la séance va permettre d'améliorer la technique du coups de pied bas pour un public débutant"
          ></Textarea>
          <FieldError>{errors?.objective?.message}</FieldError>
        </Field>
        <TwoOptionRadioField
          name="warmUp"
          legend="Pour l'échauffement ?"
          title1="J'écris moi-même l'échauffement"
          title2="Je sélectionne un échauffement tout fait"
          subtitle2="la sélection sera proposée plus tard"
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
        <TwoOptionRadioField
          name="coolDown"
          legend="Pour le retour au calme ou les étirements"
          title1="Je les écris moi-même"
          title2="Je sélectionne une fin de séance toute faite"
          subtitle2="la sélection sera proposée plus tard"
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
        <Button
          type="button"
          onClick={() => saveAndNavigate("/form/echauffement")}
        >
          {">"} Next
        </Button>
      </FieldSet>
    </Form>
  )
}

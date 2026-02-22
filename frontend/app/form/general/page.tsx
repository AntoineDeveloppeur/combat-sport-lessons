"use client"

import { useForm, UseFormRegister } from "react-hook-form"
import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "../../../components/form/Form"
import { sportList } from "@/data/sportList"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import TwoOptionRadioField from "@/components/form/TwoOptionRadioField"
import { selectlesson } from "@/features/lesson/lessonSelectors"
import { useAppSelector } from "@/store/hooks"
import FormSaveAndNavigate from "@/components/form/FormSaveAndNavigate"
import type { Lesson } from "@/types"
import ObjectiveField from "@/components/form/ObjectiveField"
import SelectField from "@/components/form/SelectField"

export default function General() {
  const lesson = useAppSelector(selectlesson)

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

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GeneralFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: lesson,
    mode: "onSubmit",
  })

  return (
    <Form>
      <FieldSet className="flex flex-col items-start w-[600px]">
        <FieldLegend className="mb-4 text-lg font-semibold">
          Général
        </FieldLegend>
        <SelectField
          lessonKey="sport"
          placeholder="Sélectionne un sport"
          selectOptions={sportList}
          register={register}
          errors={errors}
        />
        <ObjectiveField
          errors={errors}
          register={register as UseFormRegister<Lesson>}
        />
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
        <FormSaveAndNavigate
          handleSubmit={handleSubmit}
          next="/form/echauffement"
        />
      </FieldSet>
    </Form>
  )
}

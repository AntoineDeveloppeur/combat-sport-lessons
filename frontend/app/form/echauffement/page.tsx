"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext, useState, useEffect } from "react"
import { LessonContext } from "../../provider"
import { FieldSet, FieldLegend } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Button } from "@/components/ui/button"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { Instruction } from "@/components/Instruction"

export default function WarmUp() {
  const [lesson, setLesson] = useContext(LessonContext)!

  // Initialise instruction field count with lesson to avoid inputs lossg with unmounts
  const [instructionCount, setInstructionCount] = useState<number>(
    lesson.warmUpInstructions?.length || 1
  )
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
  // Infer type is mandatory otherwise forms inputs are infered from Lesson. Lesson Object properties are not mandatory
  type GeneralFormData = Yup.InferType<typeof validationSchema>
  const defaultValues = lesson.warmUpInstructions
    ? lesson
    : ({
        warmUpInstructions: [
          {
            text: "",
            min: 1,
            sec: 0,
          },
        ],
      } as GeneralFormData)

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<GeneralFormData>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  })

  /**
   * Handle dynamic form :  Instruction addition
   */

  const { fields, append, remove } = useFieldArray({
    name: "warmUpInstructions",
    control,
  })
  const addInstruction = () => {
    setInstructionCount((prev) => prev + 1)
  }

  // Update field array when instruction count change
  useEffect(() => {
    const newVal = instructionCount
    const oldVal = fields.length
    if (newVal > oldVal) {
      // append tickets to field array
      for (let i = oldVal; i < newVal; i++) {
        append({ text: "", min: 1, sec: 0 })
      }
    } else {
      // remove tickets from field array
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructionCount])

  /**
   * Handle saving form data in lesson state variable
   * Handle navigation
   */
  const saveData = (data: object) => {
    setLesson((prev) => ({ ...prev, ...data }))
    Router.push("/form/corps")
  }

  const handlePrevious = () => {
    handleSubmit((data) => {
      setLesson((prev) => ({ ...prev, ...data }))

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
        {fields.map((_field, index) => (
          <Instruction
            step="warmUpInstructions"
            id={index}
            key={index}
            errors={errors}
            register={register}
          ></Instruction>
        ))}
        <Button type="button" onClick={() => addInstruction()}>
          {" "}
          Ajouter un champs
        </Button>
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

"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import { Field, FieldLabel } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Education() {
  const [state, setState] = useContext(AppStateContext)!
  const { handleSubmit, register } = useForm({ defaultValues: state })
  const Router = useRouter()

  const saveData = (data: object) => {
    setState((prev) => ({ ...prev, ...data }))
    Router.push("/form/about")
  }

  const handlePrevious = () => {
    handleSubmit((data) => {
      setState((prev) => ({ ...prev, ...data }))
      Router.push("/form/contact")
    })()
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <fieldset className="flex flex-col items-start w-[600px]">
        <legend className="mb-4 text-lg font-semibold">Education</legend>
        <Field>
          <FieldLabel htmlFor="university">University</FieldLabel>
          <Input id="university" {...register("university")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="degree">Degree</FieldLabel>
          <Input id="degree" {...register("degree")} />
        </Field>
        <div className="flex justify-between w-full">
          <Button type="button" onClick={handlePrevious}>
            {"<"} Previous
          </Button>

          <Button>{">"} Next</Button>
        </div>
      </fieldset>
    </Form>
  )
}

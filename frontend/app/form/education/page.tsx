"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import { Field } from "../../../components/Field"
import { Form } from "../../../components/Form"
import { Input } from "../../../components/Input"
import { Button } from "@/components/Button"

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
        <Field label="University">
          <Input {...register("university")} />
        </Field>
        <Field label="Degree">
          <Input {...register("degree")} />
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

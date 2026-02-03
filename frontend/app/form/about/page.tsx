"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Textarea } from "@/components/ui/textarea"

export default function About() {
  const [state, setState] = useContext(AppStateContext)!
  const { handleSubmit, register } = useForm({ defaultValues: state })
  const Router = useRouter()

  const saveData = (data) => {
    console.log("data saved from about")
    setState((prev) => ({ ...prev, ...data }))
    Router.push("/form/confirm")
  }

  const handlePrevious = () => {
    handleSubmit((data) => {
      setState((prev) => ({ ...prev, ...data }))
      Router.push("/form/education")
    })()
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <fieldset className="flex flex-col items-start w-[600px]">
        <legend className="mb-4 text-lg font-semibold">About</legend>
        <Field>
          <FieldLabel htmlFor="about">About me</FieldLabel>
          <Textarea id="about" {...register("about")} />
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

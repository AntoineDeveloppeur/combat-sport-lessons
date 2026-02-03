"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import Link from "next/link"
import { AppStateContext } from "../../state"
import { Field } from "../../../components/Field"
import { Form } from "../../../components/Form"
import { Input } from "../../../components/Input"

export default function Education() {
  const [state, setState] = useContext(AppStateContext)!
  const { handleSubmit, register } = useForm({ defaultValues: state })
  const Router = useRouter()

  const saveData = (data) => {
    setState((prev) => ({ ...prev, ...data }))
    Router.push("/form/about")
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <fieldset className="flex flex-col items-start w-[600px]">
        <legend className="mb-4 text-lg font-semibold">Education</legend>
        <Field label="University">
          <Input {...register("university")} id="university" />
        </Field>
        <Field label="Degree">
          <Input {...register("degree")} id="degree" />
        </Field>
        <div className="flex justify-between w-full">
          <Link
            className="px-4 py-2 rounded font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white mt-6"
            href="/form/contact"
          >
            {"<"} Previous
          </Link>
          <Link
            className="px-4 py-2 rounded font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white mt-6"
            href="/form/about"
          >
            {">"} Next
          </Link>
        </div>
      </fieldset>
    </Form>
  )
}

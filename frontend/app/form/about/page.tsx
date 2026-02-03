"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import Link from "next/link"
import { AppStateContext } from "../../state"
import { Button } from "../../../components/Button"
import { Field } from "../../../components/Field"
import { Form } from "../../../components/Form"

export default function About() {
  const [state, setState] = useContext(AppStateContext)!
  const { handleSubmit, register } = useForm({ defaultValues: state })
  const Router = useRouter()

  const saveData = (data) => {
    console.log("data saved from about")
    setState((prev) => ({ ...prev, ...data }))
    Router.push("/form/confirm")
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <fieldset className="flex flex-col items-start w-[600px]">
        <legend className="mb-4 text-lg font-semibold">About</legend>
        <Field label="About me">
          <textarea
            {...register("about")}
            id="about"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </Field>
        <div className="flex justify-between w-full">
          <Link
            className="px-4 py-2 rounded font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white mt-6"
            href="/form/education"
          >
            {"<"} Previous
          </Link>

          <Button>{">"} Next</Button>
        </div>
      </fieldset>
    </Form>
  )
}

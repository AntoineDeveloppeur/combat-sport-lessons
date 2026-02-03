"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import Link from "next/link"
import { Field } from "../../../components/Field"
import { Form } from "../../../components/Form"
import { Input } from "../../../components/Input"
import { Button } from "@/components/Button"

export default function Contact() {
  const [state, setState] = useContext(AppStateContext)!
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: state, mode: "onSubmit" })
  const watchPassword = watch("password")

  const Router = useRouter()
  const saveData = (data: object) => {
    setState((prev) => ({ ...prev, ...data }))
    Router.push("/form/education")
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <fieldset className="flex flex-col items-start w-[600px]">
        <legend className="mb-4 text-lg font-semibold">Contact</legend>
        <Field label="First name" error={errors?.firstName}>
          <Input
            {...register("firstName", { required: "First name is required" })}
            id="first-name"
          />
        </Field>
        <Field label="Last name" error={errors?.lastName}>
          <Input
            {...register("lastName", { required: "Last name is required" })}
            id="last-name"
          />
        </Field>
        <Field label="Email" error={errors?.email}>
          <Input
            {...register("email", { required: "Email is required" })}
            type="email"
            id="email"
          />
        </Field>
        <Field label="Password" error={errors?.password}>
          <Input
            {...register("password", { required: "Password is required" })}
            type="password"
            id="password"
          />
        </Field>
        <Field label="Confirm password" error={errors?.confirmPassword}>
          <Input
            {...register("confirmPassword", {
              required: "Confirm the password",
              validate: (value) =>
                value === watchPassword || "The passwords do not match",
            })}
            type="password"
            id="password-confirm"
          />
        </Field>
        <Button>Next</Button>
      </fieldset>
    </Form>
  )
}

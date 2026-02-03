"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import Link from "next/link"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
        <Field>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <Input
            id="firstName"
            {...register("firstName", { required: "First name is required" })}
          />
          <FieldError>{errors?.firstName?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Last name</FieldLabel>
          <Input
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
          />
          <FieldError>{errors?.lastName?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          <FieldError>{errors?.email?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          <FieldError>{errors?.password?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Confirm the password",
              validate: (value) =>
                value === watchPassword || "The passwords do not match",
            })}
          />
          <FieldError>{errors?.confirmPassword?.message}</FieldError>
        </Field>
        <Button>Next</Button>
      </fieldset>
    </Form>
  )
}

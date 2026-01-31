"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppState } from "../../state"
import { Button } from "../../../components/Button"
import { Field } from "../../../components/Field"
import { Form } from "../../../components/Form"

export const About = () => {
  const [state, setState] = useAppState()
  const { handleSubmit, register } = useForm({ defaultValues: state })
  const Router = useRouter()

  const saveData = (data) => {
    setState({ ...state, ...data })
    Router.push("/form/confirm")
  }

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <fieldset>
        <legend>About</legend>
        <Field label="About me">
          <textarea
            {...register("about")}
            id="about"
            className="form-control"
          />
        </Field>
        <div className="button-row">
          <Link className={`btn btn-secondary`} to="/education">
            {"<"} Previous
          </Link>
          <Button>Next {">"}</Button>
        </div>
      </fieldset>
    </Form>
  )
}

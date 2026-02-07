"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import { Field, FieldSet, FieldLegend, FieldTitle } from "@/components/ui/field"
import { Form } from "../../../components/Form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function WarmUp() {
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
        <Field>
          <FieldTitle>Instructions n°1</FieldTitle>
          <Textarea></Textarea>
        </Field>
        <Field className="w-auto flex-row items-center gap-2">
          {" "}
          <Input
            className="text-center"
            type="number"
            min="0"
            max="60"
            step={1}
            defaultValue={1}
          />
          <span className="text-sm text-muted-foreground">min</span>
          <Input
            className="text-center"
            type="number"
            min="0"
            max="55"
            step={5}
            defaultValue={0}
          />
          <span className="text-sm text-muted-foreground">sec</span>
        </Field>
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

"use client"

import { useForm } from "react-hook-form"
import { useContext } from "react"
import { useRouter } from "next/navigation"
import { AppStateContext } from "../../state"
import { Button } from "@/components/ui/button"
import { Form } from "../../../components/Form"
import { Section, SectionRow } from "../../../components/Section"

export default function Confirm() {
  const [state, setState] = useContext(AppStateContext)!
  const { handleSubmit } = useForm({ defaultValues: state })
  const Router = useRouter()

  const submitData = (data) => {
    console.info(data)
    // Submit data to the server
  }

  const handlePrevious = () => {
    handleSubmit((data) => {
      setState((prev) => ({ ...prev, ...data }))
      Router.push("/form/education")
    })()
  }

  return (
    <Form onSubmit={handleSubmit(submitData)}>
      <h1 className="text-3xl font-bold mb-6">Confirm</h1>
      <Section title="Personal info" url="/">
        <SectionRow>
          <div>First name</div>
          <div>{state.firstName}</div>
        </SectionRow>
        <SectionRow>
          <div>Last name</div>
          <div>{state.lastName}</div>
        </SectionRow>
        <SectionRow>
          <div>Email</div>
          <div>{state.email}</div>
        </SectionRow>
      </Section>
      <Section title="Education" url="/education">
        <SectionRow>
          <div>University</div>
          <div>{state.university}</div>
        </SectionRow>
        <SectionRow>
          <div>Degree</div>
          <div>{state.degree}</div>
        </SectionRow>
      </Section>
      <Section title="About" url="/about">
        <SectionRow>
          <div>About me</div>
          <div>{state.about}</div>
        </SectionRow>
      </Section>
      <Button type="button" onClick={handlePrevious}>
        {"<"} Previous
      </Button>

      <div className="flex justify-start">
        <Button>Submit</Button>
      </div>
    </Form>
  )
}

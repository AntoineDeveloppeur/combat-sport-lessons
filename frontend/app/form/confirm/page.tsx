"use client"

import { useForm } from "react-hook-form"
import { useContext } from "react"
import { AppStateContext } from "../../state"
import { Button } from "../../../components/Button"
import { Form } from "../../../components/Form"
import { Section, SectionRow } from "../../../components/Section"

export default function Confirm() {
  const [state] = useContext(AppStateContext)!
  const { handleSubmit } = useForm({ defaultValues: state })

  const submitData = (data) => {
    console.info(data)
    // Submit data to the server
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
      <div className="flex justify-start">
        <Button>Submit</Button>
      </div>
    </Form>
  )
}

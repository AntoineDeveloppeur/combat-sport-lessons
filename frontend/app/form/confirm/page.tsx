"use client"

import { useForm } from "react-hook-form"
import { useContext } from "react"
import { useRouter } from "next/navigation"
import { LessonContext } from "../../provider"
import { Button } from "@/components/ui/button"
import { Form } from "../../../components/Form"
import { Section, SectionRow } from "../../../components/Section"

export default function Confirm() {
  const [lesson, setLesson] = useContext(LessonContext)!
  const { handleSubmit } = useForm({ defaultValues: lesson })
  const Router = useRouter()

  const submitData = (data) => {
    console.info(data)
    // Submit data to the server
  }

  const handlePrevious = () => {
    handleSubmit((data) => {
      setLesson((prev) => ({ ...prev, ...data }))
      Router.push("/form/echauffement")
    })()
  }

  return (
    <Form onSubmit={handleSubmit(submitData)}>
      <h1 className="text-3xl font-bold mb-6">Confirm</h1>
      <Section title="Personal info" url="/">
        <SectionRow>
          <div>First name</div>
          <div>{lesson.firstName}</div>
        </SectionRow>
        <SectionRow>
          <div>Last name</div>
          <div>{lesson.lastName}</div>
        </SectionRow>
        <SectionRow>
          <div>Email</div>
          <div>{lesson.email}</div>
        </SectionRow>
      </Section>
      <Section title="" url="/echauffement">
        <SectionRow>
          <div>University</div>
          <div>{lesson.university}</div>
        </SectionRow>
        <SectionRow>
          <div>Degree</div>
          <div>{lesson.degree}</div>
        </SectionRow>
      </Section>
      <Section title="About" url="/about">
        <SectionRow>
          <div>About me</div>
          <div>{lesson.about}</div>
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

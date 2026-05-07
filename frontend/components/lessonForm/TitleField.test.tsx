import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import TitleField from "./TitleField"
import type { Lesson } from "@/types"

const TestWrapper = ({ defaultTitle = "" }: { defaultTitle?: string }) => {
  const {
    register,
    formState: { errors },
  } = useForm<Lesson>({
    defaultValues: { title: defaultTitle },
  })

  return <TitleField register={register} errors={errors} />
}

describe("TitleField", () => {
  it("should render title input field", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    expect(input).toBeInTheDocument()
  })

  it("should have correct id attribute", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    expect(input).toHaveAttribute("id", "title")
  })

  it("should display placeholder text", () => {
    render(<TestWrapper />)

    const input = screen.getByPlaceholderText(
      /exemple : défense contre coups de pied médian/i
    )
    expect(input).toBeInTheDocument()
  })

  it("should allow typing title", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.type(input, "Ma leçon de karaté")

    expect(input).toHaveValue("Ma leçon de karaté")
  })

  it("should display default value", () => {
    render(<TestWrapper defaultTitle="Titre par défaut" />)

    const input = screen.getByLabelText(/titre/i)
    expect(input).toHaveValue("Titre par défaut")
  })

  it("should clear input value", async () => {
    const user = userEvent.setup()
    render(<TestWrapper defaultTitle="Test Title" />)

    const input = screen.getByLabelText(/titre/i)
    await user.clear(input)

    expect(input).toHaveValue("")
  })

  it("should handle special characters in title", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.type(input, "Leçon #1: Techniques d'attaque & défense")

    expect(input).toHaveValue("Leçon #1: Techniques d'attaque & défense")
  })

  it("should handle accented characters", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.type(input, "Échauffement général")

    expect(input).toHaveValue("Échauffement général")
  })

  it("should handle long titles", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const longTitle = "A".repeat(100)
    const input = screen.getByLabelText(/titre/i)
    await user.type(input, longTitle)

    expect(input).toHaveValue(longTitle)
  })

  it("should handle paste events", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.click(input)
    await user.paste("Pasted Title")

    expect(input).toHaveValue("Pasted Title")
  })

  it("should be accessible", () => {
    render(<TestWrapper />)

    const label = screen.getByText(/titre/i)
    const input = screen.getByLabelText(/titre/i)

    expect(label).toBeInTheDocument()
    expect(input).toBeEnabled()
  })

  it("should handle single character titles", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.type(input, "A")

    expect(input).toHaveValue("A")
  })

  it("should handle titles with numbers", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.type(input, "Leçon 123")

    expect(input).toHaveValue("Leçon 123")
  })

  it("should handle titles with emojis", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.type(input, "Karaté 🥋")

    expect(input).toHaveValue("Karaté 🥋")
  })

  it("should handle titles with multiple spaces", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/titre/i)
    await user.type(input, "Titre   avec   espaces")

    expect(input).toHaveValue("Titre   avec   espaces")
  })
})

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { NameField } from "./NameField"

const TestWrapper = ({ defaultName = "" }: { defaultName?: string }) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { name: defaultName },
  })

  return <NameField register={register} errors={errors} />
}

describe("NameField", () => {
  it("should render name input field", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "text")
  })

  it("should have correct id attribute", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    expect(input).toHaveAttribute("id", "name")
  })

  it("should display placeholder text", () => {
    render(<TestWrapper />)

    const input = screen.getByPlaceholderText(/gérard bouchard/i)
    expect(input).toBeInTheDocument()
  })

  it("should allow typing name", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.type(input, "Jean Dupont")

    expect(input).toHaveValue("Jean Dupont")
  })

  it("should display default value", () => {
    render(<TestWrapper defaultName="Default Name" />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    expect(input).toHaveValue("Default Name")
  })

  it("should clear input value", async () => {
    const user = userEvent.setup()
    render(<TestWrapper defaultName="Test Name" />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.clear(input)

    expect(input).toHaveValue("")
  })

  it("should handle special characters in name", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.type(input, "Jean-François O'Connor")

    expect(input).toHaveValue("Jean-François O'Connor")
  })

  it("should handle accented characters", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.type(input, "Éléonore Müller")

    expect(input).toHaveValue("Éléonore Müller")
  })

  it("should handle long names", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const longName = "A".repeat(100)
    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.type(input, longName)

    expect(input).toHaveValue(longName)
  })

  it("should handle paste events", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.click(input)
    await user.paste("Pasted Name")

    expect(input).toHaveValue("Pasted Name")
  })

  it("should be accessible", () => {
    render(<TestWrapper />)

    const label = screen.getByText(/nom ou pseudo/i)
    const input = screen.getByLabelText(/nom ou pseudo/i)

    expect(label).toBeInTheDocument()
    expect(input).toBeEnabled()
  })

  it("should handle single character names", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.type(input, "X")

    expect(input).toHaveValue("X")
  })

  it("should handle names with numbers", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.type(input, "User123")

    expect(input).toHaveValue("User123")
  })

  it("should handle names with spaces", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/nom ou pseudo/i)
    await user.type(input, "Jean Pierre Marie")

    expect(input).toHaveValue("Jean Pierre Marie")
  })
})

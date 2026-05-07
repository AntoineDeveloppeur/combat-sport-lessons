import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { EmailField } from "./EmailField"

const TestWrapper = ({ defaultEmail = "" }: { defaultEmail?: string }) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { email: defaultEmail },
  })

  return <EmailField register={register} errors={errors} />
}

describe("EmailField", () => {
  it("should render email input field", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/email/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "email")
  })

  it("should have correct id attribute", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveAttribute("id", "email")
  })

  it("should allow typing email", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/email/i)
    await user.type(input, "test@example.com")

    expect(input).toHaveValue("test@example.com")
  })

  it("should display default value", () => {
    render(<TestWrapper defaultEmail="default@test.com" />)

    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveValue("default@test.com")
  })

  it("should clear input value", async () => {
    const user = userEvent.setup()
    render(<TestWrapper defaultEmail="test@example.com" />)

    const input = screen.getByLabelText(/email/i)
    await user.clear(input)

    expect(input).toHaveValue("")
  })

  it("should accept various email formats", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/email/i)

    await user.type(input, "user+tag@example.co.uk")
    expect(input).toHaveValue("user+tag@example.co.uk")
  })

  it("should handle special characters in email", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/email/i)
    await user.type(input, "user.name+tag@sub.example.com")

    expect(input).toHaveValue("user.name+tag@sub.example.com")
  })

  it("should be accessible", () => {
    render(<TestWrapper />)

    const label = screen.getByText(/email/i)
    const input = screen.getByLabelText(/email/i)

    expect(label).toBeInTheDocument()
    expect(input).toBeEnabled()
  })

  it("should handle paste events", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/email/i)
    await user.click(input)
    await user.paste("pasted@email.com")

    expect(input).toHaveValue("pasted@email.com")
  })

  it("should handle long email addresses", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const longEmail = "verylongemailaddress" + "a".repeat(50) + "@example.com"
    const input = screen.getByLabelText(/email/i)
    await user.type(input, longEmail)

    expect(input).toHaveValue(longEmail)
  })
})

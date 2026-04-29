import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { PasswordField } from "./PasswordField"

const TestWrapper = ({
  defaultPassword = "",
  showForgotPassword = false,
}: {
  defaultPassword?: string
  showForgotPassword?: boolean
}) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { password: defaultPassword },
  })

  return (
    <PasswordField
      register={register}
      errors={errors}
      showForgotPassword={showForgotPassword}
    />
  )
}

describe("PasswordField", () => {
  it("should render password input field", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/mot de passe/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "password")
  })

  it("should have correct id attribute", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/mot de passe/i)
    expect(input).toHaveAttribute("id", "password")
  })

  it("should allow typing password", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/mot de passe/i)
    await user.type(input, "SecurePassword123!")

    expect(input).toHaveValue("SecurePassword123!")
  })

  it("should display default value", () => {
    render(<TestWrapper defaultPassword="defaultPass123" />)

    const input = screen.getByLabelText(/mot de passe/i)
    expect(input).toHaveValue("defaultPass123")
  })

  it("should mask password input", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/mot de passe/i)
    await user.type(input, "secret")

    expect(input).toHaveAttribute("type", "password")
  })

  it("should not show forgot password link by default", () => {
    render(<TestWrapper />)

    const link = screen.queryByText(/mot de passe oublié/i)
    expect(link).not.toBeInTheDocument()
  })

  it("should show forgot password link when showForgotPassword is true", () => {
    render(<TestWrapper showForgotPassword={true} />)

    const link = screen.getByText(/mot de passe oublié/i)
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/404")
  })

  it("should have correct link styling for forgot password", () => {
    render(<TestWrapper showForgotPassword={true} />)

    const link = screen.getByText(/mot de passe oublié/i)
    expect(link).toHaveClass("ml-auto")
    expect(link).toHaveClass("underline-offset-4")
    expect(link).toHaveClass("hover:underline")
  })

  it("should clear input value", async () => {
    const user = userEvent.setup()
    render(<TestWrapper defaultPassword="password123" />)

    const input = screen.getByLabelText(/mot de passe/i)
    await user.clear(input)

    expect(input).toHaveValue("")
  })

  it("should handle special characters in password", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/mot de passe/i)
    await user.type(input, "P@ssw0rd!#$%^&*()")

    expect(input).toHaveValue("P@ssw0rd!#$%^&*()")
  })

  it("should handle long passwords", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const longPassword = "a".repeat(100)
    const input = screen.getByLabelText(/mot de passe/i)
    await user.type(input, longPassword)

    expect(input).toHaveValue(longPassword)
  })

  it("should handle paste events", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/mot de passe/i) as HTMLInputElement
    await user.clear(input)
    await user.paste("pastedPassword123")

    expect(input).toHaveValue("pastedPassword123")
  })

  it("should be accessible", () => {
    render(<TestWrapper />)

    const label = screen.getByText(/mot de passe/i)
    const input = screen.getByLabelText(/mot de passe/i)

    expect(label).toBeInTheDocument()
    expect(input).toBeEnabled()
  })

  it("should handle spaces in password", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/mot de passe/i)
    await user.type(input, "pass word with spaces")

    expect(input).toHaveValue("pass word with spaces")
  })
})

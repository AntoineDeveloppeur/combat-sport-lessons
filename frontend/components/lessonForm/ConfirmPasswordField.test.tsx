import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm } from "react-hook-form"
import { ConfirmPasswordField } from "./ConfirmPasswordField"

const TestWrapper = ({
  defaultConfirmPassword = "",
}: {
  defaultConfirmPassword?: string
}) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { confirmPassword: defaultConfirmPassword },
  })

  return (
    <ConfirmPasswordField
      register={register}
      errors={errors}
    />
  )
}

describe("ConfirmPasswordField", () => {
  it("should render confirm password input field", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "password")
  })

  it("should have correct id attribute", () => {
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    expect(input).toHaveAttribute("id", "confirm-password")
  })

  it("should allow typing password", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.type(input, "ConfirmPassword123!")

    expect(input).toHaveValue("ConfirmPassword123!")
  })

  it("should display default value", () => {
    render(<TestWrapper defaultConfirmPassword="defaultPass123" />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    expect(input).toHaveValue("defaultPass123")
  })

  it("should mask password input", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.type(input, "secret")

    expect(input).toHaveAttribute("type", "password")
  })

  it("should clear input value", async () => {
    const user = userEvent.setup()
    render(<TestWrapper defaultConfirmPassword="password123" />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.clear(input)

    expect(input).toHaveValue("")
  })

  it("should handle special characters in password", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.type(input, "P@ssw0rd!#$%^&*()")

    expect(input).toHaveValue("P@ssw0rd!#$%^&*()")
  })

  it("should handle long passwords", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const longPassword = "a".repeat(100)
    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.type(input, longPassword)

    expect(input).toHaveValue(longPassword)
  })

  it("should handle paste events", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.click(input)
    await user.paste("pastedPassword123")

    expect(input).toHaveValue("pastedPassword123")
  })

  it("should be accessible", () => {
    render(<TestWrapper />)

    const label = screen.getByText(/confirmer le mot de passe/i)
    const input = screen.getByLabelText(/confirmer le mot de passe/i)

    expect(label).toBeInTheDocument()
    expect(input).toBeEnabled()
  })

  it("should handle spaces in password", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.type(input, "pass word with spaces")

    expect(input).toHaveValue("pass word with spaces")
  })

  it("should handle unicode characters", async () => {
    const user = userEvent.setup()
    render(<TestWrapper />)

    const input = screen.getByLabelText(/confirmer le mot de passe/i)
    await user.type(input, "пароль密码🔒")

    expect(input).toHaveValue("пароль密码🔒")
  })
})

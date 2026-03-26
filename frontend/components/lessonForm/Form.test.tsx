import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Form } from "./Form"

describe("Form", () => {
  it("should render a form element", () => {
    const { container } = render(<Form>Test content</Form>)
    const form = container.querySelector("form")
    expect(form).toBeInTheDocument()
  })

  it("should render children inside the form", () => {
    render(
      <Form>
        <input type="text" />
        <button>Submit</button>
      </Form>
    )

    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("should have noValidate attribute", () => {
    const { container } = render(<Form>Content</Form>)
    const form = container.querySelector("form")
    expect(form).toHaveAttribute("noValidate")
  })

  it("should forward onSubmit handler", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault())
    const { container } = render(<Form onSubmit={handleSubmit}>Content</Form>)

    const form = container.querySelector("form")
    form?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    )

    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it("should forward other form attributes", () => {
    const { container } = render(
      <Form id="test-form" data-testid="custom-form">
        Content
      </Form>
    )

    const form = container.querySelector("form")
    expect(form).toHaveAttribute("id", "test-form")
    expect(form).toHaveAttribute("data-testid", "custom-form")
  })

  it("should forward method attribute", () => {
    const { container } = render(<Form method="post">Content</Form>)
    const form = container.querySelector("form")
    expect(form).toHaveAttribute("method", "post")
  })

  it("should forward action attribute", () => {
    const { container } = render(<Form action="/submit">Content</Form>)
    const form = container.querySelector("form")
    expect(form).toHaveAttribute("action", "/submit")
  })

  it("should forward aria attributes", () => {
    render(
      <Form aria-label="Test form" aria-describedby="form-description">
        Content
      </Form>
    )

    const form = screen.getByRole("form")
    expect(form).toHaveAttribute("aria-label", "Test form")
    expect(form).toHaveAttribute("aria-describedby", "form-description")
  })

  it("should render multiple children correctly", () => {
    render(
      <Form>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </Form>
    )

    expect(screen.getByText("First child")).toBeInTheDocument()
    expect(screen.getByText("Second child")).toBeInTheDocument()
    expect(screen.getByText("Third child")).toBeInTheDocument()
  })

  it("should spread all FormHTMLAttributes props", () => {
    render(
      <Form autoComplete="off" encType="multipart/form-data" name="test-form">
        Content
      </Form>
    )

    const form = screen.getByRole("form")
    expect(form).toHaveAttribute("autoComplete", "off")
    expect(form).toHaveAttribute("encType", "multipart/form-data")
    expect(form).toHaveAttribute("name", "test-form")
  })
})

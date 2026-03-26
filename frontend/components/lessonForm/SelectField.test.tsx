import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import SelectField from "./SelectField"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Lesson } from "@/types/index"

describe("Select", () => {
  const mockRegister: UseFormRegister<Lesson> = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }))

  const defaultProps = {
    presetType: "sport" as keyof Lesson,
    placeholder: "Choose a sport",
    selectOptions: ["Boxing", "Judo", "Karate"],
    register: mockRegister,
    errors: {} as FieldErrors<Lesson>,
  }

  it("should render a select element", () => {
    const { container } = render(<SelectField {...defaultProps} />)
    const select = container.querySelector("select")
    expect(select).toBeInTheDocument()
  })

  it("should render placeholder as first option", () => {
    render(<SelectField {...defaultProps} />)
    const options = screen.getAllByRole("option")
    expect(options[0]).toHaveTextContent("Choose a sport")
    expect(options[0]).toHaveValue("")
  })

  it("should render all select options", () => {
    render(<SelectField {...defaultProps} />)
    const options = screen.getAllByRole("option")

    expect(options).toHaveLength(4)
    expect(options[1]).toHaveTextContent("Boxing")
    expect(options[2]).toHaveTextContent("Judo")
    expect(options[3]).toHaveTextContent("Karate")
  })

  it("should set correct values for options", () => {
    render(<SelectField {...defaultProps} />)
    const options = screen.getAllByRole("option")

    expect(options[1]).toHaveValue("Boxing")
    expect(options[2]).toHaveValue("Judo")
    expect(options[3]).toHaveValue("Karate")
  })

  it("should call register with correct presetType", () => {
    render(<SelectField {...defaultProps} presetType="objective" />)
    expect(mockRegister).toHaveBeenCalledWith("objective")
  })

  it("should display error message when present", () => {
    const errorsWithMessage: FieldErrors<Lesson> = {
      sport: { message: "Sport is required", type: "required" },
    }

    render(<SelectField {...defaultProps} errors={errorsWithMessage} />)
    expect(screen.getByText("Sport is required")).toBeInTheDocument()
  })

  it("should not display error when errors object is empty", () => {
    const { container } = render(<SelectField {...defaultProps} />)
    const errorElement = container.querySelector('[class*="error"]')

    if (errorElement) {
      expect(errorElement.textContent).toBe("")
    }
  })

  it("should render with different presetType", () => {
    render(
      <SelectField
        {...defaultProps}
        presetType="warmUpPresetTitle"
        placeholder="Select warm up"
        selectOptions={["Preset 1", "Preset 2"]}
      />
    )

    expect(mockRegister).toHaveBeenCalledWith("warmUpPresetTitle")
    expect(screen.getByText("Select warm up")).toBeInTheDocument()
  })

  it("should render empty select when selectOptions is empty", () => {
    render(<SelectField {...defaultProps} selectOptions={[]} />)
    const options = screen.getAllByRole("option")

    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent("Choose a sport")
  })

  it("should render with single option", () => {
    render(<SelectField {...defaultProps} selectOptions={["Only Option"]} />)
    const options = screen.getAllByRole("option")

    expect(options).toHaveLength(2)
    expect(options[1]).toHaveTextContent("Only Option")
  })

  it("should use option value as key", () => {
    const { container } = render(<SelectField {...defaultProps} />)
    const options = container.querySelectorAll("option")

    expect(options[1]).toHaveAttribute("value", "Boxing")
    expect(options[2]).toHaveAttribute("value", "Judo")
    expect(options[3]).toHaveAttribute("value", "Karate")
  })

  it("should handle different error for different presetType", () => {
    const errorsWithObjective: FieldErrors<Lesson> = {
      objective: { message: "Objective is required", type: "required" },
    }

    render(
      <SelectField
        {...defaultProps}
        presetType="objective"
        errors={errorsWithObjective}
      />
    )

    expect(screen.getByText("Objective is required")).toBeInTheDocument()
  })

  it("should not display error for different presetType", () => {
    const errorsWithSport: FieldErrors<Lesson> = {
      sport: { message: "Sport is required", type: "required" },
    }

    const { container } = render(
      <SelectField
        {...defaultProps}
        presetType="objective"
        errors={errorsWithSport}
      />
    )

    const errorElement = container.querySelector('[class*="error"]')
    if (errorElement) {
      expect(errorElement.textContent).toBe("")
    }
  })
})

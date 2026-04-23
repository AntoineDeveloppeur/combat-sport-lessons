import { describe, it, expect, vi } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import InstructionField from "./InstructionField"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Lesson } from "@/types/index"

describe("Instruction", () => {
  const mockRegister: UseFormRegister<Lesson> = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }))

  const defaultProps = {
    step: "warmUpInstructions" as const,
    id: 0,
    errors: {} as FieldErrors<Lesson>,
    register: mockRegister,
    getValues: vi.fn(),
  }

  it("should render the instruction title with correct number", () => {
    renderWithProvider(<InstructionField {...defaultProps} />)
    expect(screen.getByText("Instruction n°1")).toBeInTheDocument()
  })

  it("should render instruction title with id + 1", () => {
    renderWithProvider(<InstructionField {...defaultProps} id={2} />)
    expect(screen.getByText("Instruction n°3")).toBeInTheDocument()
  })

  it("should render a textarea for instruction text", () => {
    renderWithProvider(<InstructionField {...defaultProps} />)
    const textarea = document.querySelector("textarea")
    expect(textarea).toBeInTheDocument()
  })

  it("should render two number inputs for minutes and seconds", () => {
    renderWithProvider(<InstructionField {...defaultProps} />)
    const numberInputs = screen.getAllByRole("spinbutton")
    expect(numberInputs).toHaveLength(2)
  })

  it("should render minutes input with correct attributes", () => {
    renderWithProvider(<InstructionField {...defaultProps} />)
    const inputs = screen.getAllByRole("spinbutton")
    const minInput = inputs[0]

    expect(minInput).toHaveAttribute("type", "number")
    expect(minInput).toHaveAttribute("min", "0")
    expect(minInput).toHaveAttribute("max", "60")
    expect(minInput).toHaveAttribute("step", "1")
  })

  it("should render seconds input with correct attributes", () => {
    renderWithProvider(<InstructionField {...defaultProps} />)
    const inputs = screen.getAllByRole("spinbutton")
    const secInput = inputs[1]

    expect(secInput).toHaveAttribute("type", "number")
    expect(secInput).toHaveAttribute("min", "0")
    expect(secInput).toHaveAttribute("max", "55")
    expect(secInput).toHaveAttribute("step", "5")
  })

  it("should render min and sec labels", () => {
    renderWithProvider(<InstructionField {...defaultProps} />)
    expect(screen.getByText("min")).toBeInTheDocument()
    expect(screen.getByText("sec")).toBeInTheDocument()
  })

  it("should call register with correct field names", () => {
    renderWithProvider(
      <InstructionField {...defaultProps} step="bodyInstructions" id={1} />
    )

    expect(mockRegister).toHaveBeenCalledWith("bodyInstructions.1.text")
    expect(mockRegister).toHaveBeenCalledWith("bodyInstructions.1.min")
    expect(mockRegister).toHaveBeenCalledWith("bodyInstructions.1.sec")
  })

  it("should display text error message when present", () => {
    const errorsWithTextError: FieldErrors<Lesson> = {
      warmUpInstructions: [
        {
          text: { message: "Text is required", type: "required" },
        },
      ],
    }

    renderWithProvider(
      <InstructionField {...defaultProps} errors={errorsWithTextError} />
    )
    expect(screen.getByText("Text is required")).toBeInTheDocument()
  })

  it("should display min error message when present", () => {
    const errorsWithMinError: FieldErrors<Lesson> = {
      warmUpInstructions: [
        {
          min: { message: "Min must be valid", type: "min" },
        },
      ],
    }

    renderWithProvider(
      <InstructionField {...defaultProps} errors={errorsWithMinError} />
    )
    expect(screen.getByText("Min must be valid")).toBeInTheDocument()
  })

  it("should display sec error message when present", () => {
    const errorsWithSecError: FieldErrors<Lesson> = {
      warmUpInstructions: [
        {
          sec: { message: "Sec must be valid", type: "max" },
        },
      ],
    }

    renderWithProvider(
      <InstructionField {...defaultProps} errors={errorsWithSecError} />
    )
    expect(screen.getByText("Sec must be valid")).toBeInTheDocument()
  })

  it("should display multiple error messages simultaneously", () => {
    const errorsWithMultiple: FieldErrors<Lesson> = {
      coolDownInstructions: [
        {
          text: { message: "Text error", type: "required" },
          min: { message: "Min error", type: "min" },
          sec: { message: "Sec error", type: "max" },
        },
      ],
    }

    renderWithProvider(
      <InstructionField
        {...defaultProps}
        step="coolDownInstructions"
        errors={errorsWithMultiple}
      />
    )

    expect(screen.getByText("Text error")).toBeInTheDocument()
    expect(screen.getByText("Min error")).toBeInTheDocument()
    expect(screen.getByText("Sec error")).toBeInTheDocument()
  })

  it("should not display errors when errors object is empty", () => {
    renderWithProvider(<InstructionField {...defaultProps} />)
    const errorElements = document.querySelectorAll('[class*="error"]')
    errorElements.forEach((element) => {
      expect(element.textContent).toBe("")
    })
  })
})

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ObjectiveField from "./ObjectiveField"
import type { Lesson } from "@/types"
import { FieldErrors, UseFormRegister } from "react-hook-form"

describe("ObjectiveField", () => {
  const mockRegister = vi.fn(() => ({
    name: "objective",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  })) as unknown as UseFormRegister<Lesson>

  const defaultProps = {
    errors: {} as FieldErrors<Lesson>,
    register: mockRegister,
  }

  it("should render the label with correct text", () => {
    render(<ObjectiveField {...defaultProps} />)

    expect(screen.getByText("Objectif de la séance")).toBeInTheDocument()
  })

  it("should render the label as a label element", () => {
    render(<ObjectiveField {...defaultProps} />)

    const label = screen.getByText("Objectif de la séance")
    expect(label.tagName).toBe("LABEL")
  })

  it("should render the label with correct htmlFor attribute", () => {
    render(<ObjectiveField {...defaultProps} />)

    const label = screen.getByText("Objectif de la séance")
    expect(label).toHaveAttribute("for", "objective")
  })

  it("should render the textarea", () => {
    const { container } = render(<ObjectiveField {...defaultProps} />)

    const textarea = container.querySelector("textarea")
    expect(textarea).toBeInTheDocument()
  })

  it("should render textarea with correct id", () => {
    const { container } = render(<ObjectiveField {...defaultProps} />)

    const textarea = container.querySelector("textarea")
    expect(textarea).toHaveAttribute("id", "objective")
  })

  it("should render textarea with correct placeholder", () => {
    const { container } = render(<ObjectiveField {...defaultProps} />)

    const textarea = container.querySelector("textarea")
    expect(textarea).toHaveAttribute(
      "placeholder",
      "Exemple : la séance va permettre d'améliorer la technique du coups de pied bas pour un public débutant"
    )
  })

  it("should call register with 'objective' field name", () => {
    render(<ObjectiveField {...defaultProps} />)

    expect(mockRegister).toHaveBeenCalledWith("objective")
  })

  it("should display error message when error exists", () => {
    const propsWithError = {
      ...defaultProps,
      errors: {
        objective: {
          message: "L'objectif doit contenir au moins 20 caractères",
          type: "min",
        },
      } as FieldErrors<Lesson>,
    }

    render(<ObjectiveField {...propsWithError} />)

    expect(
      screen.getByText("L'objectif doit contenir au moins 20 caractères")
    ).toBeInTheDocument()
  })

  it("should not display error message when no error exists", () => {
    render(<ObjectiveField {...defaultProps} />)

    const errorElement = screen.queryByText(
      "L'objectif doit contenir au moins 20 caractères"
    )
    expect(errorElement).not.toBeInTheDocument()
  })

  it("should display required error message", () => {
    const propsWithError = {
      ...defaultProps,
      errors: {
        objective: {
          message: "Veuillez décrire l'objectif de la séance",
          type: "required",
        },
      } as FieldErrors<Lesson>,
    }

    render(<ObjectiveField {...propsWithError} />)

    expect(
      screen.getByText("Veuillez décrire l'objectif de la séance")
    ).toBeInTheDocument()
  })

  it("should display max length error message", () => {
    const propsWithError = {
      ...defaultProps,
      errors: {
        objective: {
          message: "L'objectif ne peut pas dépasser 500 caractères",
          type: "max",
        },
      } as FieldErrors<Lesson>,
    }

    render(<ObjectiveField {...propsWithError} />)

    expect(
      screen.getByText("L'objectif ne peut pas dépasser 500 caractères")
    ).toBeInTheDocument()
  })

  it("should render Field component wrapper", () => {
    const { container } = render(<ObjectiveField {...defaultProps} />)

    const field = container.firstChild
    expect(field).toBeInTheDocument()
  })

  it("should have textarea as child of Field", () => {
    const { container } = render(<ObjectiveField {...defaultProps} />)

    const textarea = container.querySelector("textarea")
    expect(textarea?.parentElement).toBeTruthy()
  })
})

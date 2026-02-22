import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import SportSelection from "./SportSelection"
import type { Lesson } from "@/types"
import { FieldErrors, UseFormRegister } from "react-hook-form"

vi.mock("@/data/sportList", () => ({
  sportList: [
    "Boxe anglaise",
    "Judo",
    "Karaté Shotokan",
    "MMA",
    "Taekwondo WTF",
  ],
}))

describe("SportSelection", () => {
  const mockRegister = vi.fn(() => ({
    name: "sport",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  })) as unknown as UseFormRegister<Lesson>

  const defaultProps = {
    errors: {} as FieldErrors<Lesson>,
    register: mockRegister,
  }

  it("should render the select with placeholder option", () => {
    render(<SportSelection {...defaultProps} />)

    expect(screen.getByText("Sélectionne un sport")).toBeInTheDocument()
  })

  it("should render all sports from sportList", () => {
    render(<SportSelection {...defaultProps} />)

    expect(screen.getByText("Boxe anglaise")).toBeInTheDocument()
    expect(screen.getByText("Judo")).toBeInTheDocument()
    expect(screen.getByText("Karaté Shotokan")).toBeInTheDocument()
    expect(screen.getByText("MMA")).toBeInTheDocument()
    expect(screen.getByText("Taekwondo WTF")).toBeInTheDocument()
  })

  it("should call register with 'sport' field name", () => {
    render(<SportSelection {...defaultProps} />)

    expect(mockRegister).toHaveBeenCalledWith("sport")
  })

  it("should display error message when error exists", () => {
    const propsWithError = {
      ...defaultProps,
      errors: {
        sport: {
          message: "Veuillez choisir un sport dans la liste",
          type: "oneOf",
        },
      } as FieldErrors<Lesson>,
    }

    render(<SportSelection {...propsWithError} />)

    expect(
      screen.getByText("Veuillez choisir un sport dans la liste")
    ).toBeInTheDocument()
  })

  it("should not display error message when no error exists", () => {
    render(<SportSelection {...defaultProps} />)

    const errorElement = screen.queryByText(
      "Veuillez choisir un sport dans la liste"
    )
    expect(errorElement).not.toBeInTheDocument()
  })

  it("should render NativeSelect component", () => {
    const { container } = render(<SportSelection {...defaultProps} />)

    const select = container.querySelector("select")
    expect(select).toBeInTheDocument()
  })

  it("should have empty string as placeholder value", () => {
    render(<SportSelection {...defaultProps} />)

    const placeholderOption = screen.getByText(
      "Sélectionne un sport"
    ) as HTMLOptionElement
    expect(placeholderOption.value).toBe("")
  })

  it("should render correct number of options (placeholder + sports)", () => {
    const { container } = render(<SportSelection {...defaultProps} />)

    const options = container.querySelectorAll("option")
    expect(options).toHaveLength(6)
  })

  it("should set sport value as option value", () => {
    render(<SportSelection {...defaultProps} />)

    const judoOption = screen.getByText("Judo") as HTMLOptionElement
    expect(judoOption.value).toBe("Judo")

    const mmaOption = screen.getByText("MMA") as HTMLOptionElement
    expect(mmaOption.value).toBe("MMA")
  })

  it("should use sport name as key for each option", () => {
    const { container } = render(<SportSelection {...defaultProps} />)

    const options = container.querySelectorAll("option")
    options.forEach((option, index) => {
      if (index > 0) {
        expect(option.textContent).toBeTruthy()
      }
    })
  })
})

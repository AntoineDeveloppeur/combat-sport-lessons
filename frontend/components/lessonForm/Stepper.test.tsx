import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Stepper } from "./Stepper"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}))

const { usePathname } = await import("next/navigation")

describe("Stepper", () => {
  it("should render a nav element", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    const { container } = render(<Stepper />)
    const nav = container.querySelector("nav")
    expect(nav).toBeInTheDocument()
  })

  it("should render all four navigation steps", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    expect(screen.getByText("Général")).toBeInTheDocument()
    expect(screen.getByText("Échauffement")).toBeInTheDocument()
    expect(screen.getByText("Corps de séance")).toBeInTheDocument()
    expect(screen.getByText("Retour au calme")).toBeInTheDocument()
  })

  it("should render 'Général' step", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const generalStep = screen.getByText("Général")
    expect(generalStep).toBeInTheDocument()
  })

  it("should render 'Échauffement' step", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const echauffementStep = screen.getByText("Échauffement")
    expect(echauffementStep).toBeInTheDocument()
  })

  it("should render 'Corps de séance' step", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const corpsStep = screen.getByText("Corps de séance")
    expect(corpsStep).toBeInTheDocument()
  })

  it("should render 'Retour au calme' step", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const calmeStep = screen.getByText("Retour au calme")
    expect(calmeStep).toBeInTheDocument()
  })

  it("should highlight 'Général' when on /form/general", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const generalStep = screen.getByText("Général")
    expect(generalStep).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight 'Échauffement' when on /form/general", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const echauffementStep = screen.getByText("Échauffement")
    expect(echauffementStep).toHaveClass("font-medium", "text-gray-600")
    expect(echauffementStep).not.toHaveClass("font-bold", "text-blue-600")
  })

  it("should highlight 'Échauffement' when on /form/echauffement", () => {
    vi.mocked(usePathname).mockReturnValue("/form/echauffement")
    render(<Stepper />)

    const echauffementStep = screen.getByText("Échauffement")
    expect(echauffementStep).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight 'Général' when on /form/echauffement", () => {
    vi.mocked(usePathname).mockReturnValue("/form/echauffement")
    render(<Stepper />)

    const generalStep = screen.getByText("Général")
    expect(generalStep).toHaveClass("font-medium", "text-gray-600")
    expect(generalStep).not.toHaveClass("font-bold", "text-blue-600")
  })

  it("should highlight 'Corps de séance' when on /form/corps", () => {
    vi.mocked(usePathname).mockReturnValue("/form/corps")
    render(<Stepper />)

    const corpsStep = screen.getByText("Corps de séance")
    expect(corpsStep).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight other steps when on /form/corps", () => {
    vi.mocked(usePathname).mockReturnValue("/form/corps")
    render(<Stepper />)

    const generalStep = screen.getByText("Général")
    const echauffementStep = screen.getByText("Échauffement")
    const calmeStep = screen.getByText("Retour au calme")

    expect(generalStep).toHaveClass("font-medium", "text-gray-600")
    expect(echauffementStep).toHaveClass("font-medium", "text-gray-600")
    expect(calmeStep).toHaveClass("font-medium", "text-gray-600")
  })

  it("should highlight 'Retour au calme' when on /form/calme", () => {
    vi.mocked(usePathname).mockReturnValue("/form/calme")
    render(<Stepper />)

    const calmeStep = screen.getByText("Retour au calme")
    expect(calmeStep).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight any step when on different path", () => {
    vi.mocked(usePathname).mockReturnValue("/other/path")
    render(<Stepper />)

    const generalStep = screen.getByText("Général")
    const echauffementStep = screen.getByText("Échauffement")
    const corpsStep = screen.getByText("Corps de séance")
    const calmeStep = screen.getByText("Retour au calme")

    expect(generalStep).toHaveClass("font-medium", "text-gray-600")
    expect(echauffementStep).toHaveClass("font-medium", "text-gray-600")
    expect(corpsStep).toHaveClass("font-medium", "text-gray-600")
    expect(calmeStep).toHaveClass("font-medium", "text-gray-600")
  })

  it("should render an ordered list", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    const { container } = render(<Stepper />)

    const ol = container.querySelector("ol")
    expect(ol).toBeInTheDocument()
  })

  it("should render four list items", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    const { container } = render(<Stepper />)

    const listItems = container.querySelectorAll("li")
    expect(listItems).toHaveLength(4)
  })

  it("should apply highlight function correctly for active path", () => {
    vi.mocked(usePathname).mockReturnValue("/form/echauffement")
    render(<Stepper />)

    const activeStep = screen.getByText("Échauffement")
    const inactiveStep = screen.getByText("Général")

    expect(activeStep.className).toContain("font-bold")
    expect(activeStep.className).toContain("text-blue-600")
    expect(inactiveStep.className).toContain("font-medium")
    expect(inactiveStep.className).toContain("text-gray-600")
  })

  it("should only highlight one step at a time", () => {
    vi.mocked(usePathname).mockReturnValue("/form/corps")
    const { container } = render(<Stepper />)

    const steps = container.querySelectorAll("p")
    const highlightedSteps = Array.from(steps).filter((step) =>
      step.className.includes("font-bold text-blue-600"),
    )

    expect(highlightedSteps).toHaveLength(1)
    expect(highlightedSteps[0]).toHaveTextContent("Corps de séance")
  })
})

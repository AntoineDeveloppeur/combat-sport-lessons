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

  it("should render all four navigation links", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(4)
  })

  it("should render 'Général' link with correct href", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const generalLink = screen.getByRole("link", { name: "Général" })
    expect(generalLink).toBeInTheDocument()
    expect(generalLink).toHaveAttribute("href", "/form/general")
  })

  it("should render 'Échauffement' link with correct href", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const echauffementLink = screen.getByRole("link", { name: "Échauffement" })
    expect(echauffementLink).toBeInTheDocument()
    expect(echauffementLink).toHaveAttribute("href", "/form/echauffement")
  })

  it("should render 'Corps de séance' link with correct href", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const corpsLink = screen.getByRole("link", { name: "Corps de séance" })
    expect(corpsLink).toBeInTheDocument()
    expect(corpsLink).toHaveAttribute("href", "/form/corps")
  })

  it("should render 'Retour au calme' link with correct href", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const calmeLink = screen.getByRole("link", { name: "Retour au calme" })
    expect(calmeLink).toBeInTheDocument()
    expect(calmeLink).toHaveAttribute("href", "/form/calme")
  })

  it("should highlight 'Général' when on /form/general", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const generalLink = screen.getByRole("link", { name: "Général" })
    expect(generalLink).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight 'Échauffement' when on /form/general", () => {
    vi.mocked(usePathname).mockReturnValue("/form/general")
    render(<Stepper />)

    const echauffementLink = screen.getByRole("link", { name: "Échauffement" })
    expect(echauffementLink).toHaveClass("font-medium", "text-gray-600")
    expect(echauffementLink).not.toHaveClass("font-bold", "text-blue-600")
  })

  it("should highlight 'Échauffement' when on /form/echauffement", () => {
    vi.mocked(usePathname).mockReturnValue("/form/echauffement")
    render(<Stepper />)

    const echauffementLink = screen.getByRole("link", { name: "Échauffement" })
    expect(echauffementLink).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight 'Général' when on /form/echauffement", () => {
    vi.mocked(usePathname).mockReturnValue("/form/echauffement")
    render(<Stepper />)

    const generalLink = screen.getByRole("link", { name: "Général" })
    expect(generalLink).toHaveClass("font-medium", "text-gray-600")
    expect(generalLink).not.toHaveClass("font-bold", "text-blue-600")
  })

  it("should highlight 'Corps de séance' when on /form/corps", () => {
    vi.mocked(usePathname).mockReturnValue("/form/corps")
    render(<Stepper />)

    const corpsLink = screen.getByRole("link", { name: "Corps de séance" })
    expect(corpsLink).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight other links when on /form/corps", () => {
    vi.mocked(usePathname).mockReturnValue("/form/corps")
    render(<Stepper />)

    const generalLink = screen.getByRole("link", { name: "Général" })
    const echauffementLink = screen.getByRole("link", { name: "Échauffement" })
    const calmeLink = screen.getByRole("link", { name: "Retour au calme" })

    expect(generalLink).toHaveClass("font-medium", "text-gray-600")
    expect(echauffementLink).toHaveClass("font-medium", "text-gray-600")
    expect(calmeLink).toHaveClass("font-medium", "text-gray-600")
  })

  it("should highlight 'Retour au calme' when on /form/calme", () => {
    vi.mocked(usePathname).mockReturnValue("/form/calme")
    render(<Stepper />)

    const calmeLink = screen.getByRole("link", { name: "Retour au calme" })
    expect(calmeLink).toHaveClass("font-bold", "text-blue-600")
  })

  it("should not highlight any link when on different path", () => {
    vi.mocked(usePathname).mockReturnValue("/other/path")
    render(<Stepper />)

    const generalLink = screen.getByRole("link", { name: "Général" })
    const echauffementLink = screen.getByRole("link", { name: "Échauffement" })
    const corpsLink = screen.getByRole("link", { name: "Corps de séance" })
    const calmeLink = screen.getByRole("link", { name: "Retour au calme" })

    expect(generalLink).toHaveClass("font-medium", "text-gray-600")
    expect(echauffementLink).toHaveClass("font-medium", "text-gray-600")
    expect(corpsLink).toHaveClass("font-medium", "text-gray-600")
    expect(calmeLink).toHaveClass("font-medium", "text-gray-600")
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

    const activeLink = screen.getByRole("link", { name: "Échauffement" })
    const inactiveLink = screen.getByRole("link", { name: "Général" })

    expect(activeLink.className).toContain("font-bold")
    expect(activeLink.className).toContain("text-blue-600")
    expect(inactiveLink.className).toContain("font-medium")
    expect(inactiveLink.className).toContain("text-gray-600")
  })

  it("should only highlight one link at a time", () => {
    vi.mocked(usePathname).mockReturnValue("/form/corps")
    render(<Stepper />)

    const links = screen.getAllByRole("link")
    const highlightedLinks = links.filter((link) =>
      link.className.includes("font-bold text-blue-600")
    )

    expect(highlightedLinks).toHaveLength(1)
    expect(highlightedLinks[0]).toHaveTextContent("Corps de séance")
  })
})

import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import WarmUp from "./page"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock("@/data/warmUpPreset", () => ({
  warmUpPresetTitles: ["shadowBoxing", "course à pied"],
}))

describe("WarmUp page", () => {
  it('with custom: click on "ajouter champs" adds an Instruction component', async () => {
    // Arrange
    const user = userEvent.setup()

    renderWithProvider(<WarmUp />, { warmUp: "custom" })

    // Vérifie qu'il y a 1 instruction au départ
    expect(screen.getByText(/Instruction n°1/i)).toBeInTheDocument()
    expect(screen.queryByText(/Instruction n°2/i)).not.toBeInTheDocument()

    // Act
    const addButton = screen.getByRole("button", { name: /ajouter un champs/i })
    await user.click(addButton)

    // Assert
    expect(screen.getByText(/Instruction n°1/i)).toBeInTheDocument()
    expect(screen.getByText(/Instruction n°2/i)).toBeInTheDocument()
  })
  it("with preset: render NativeSelectOption", async () => {
    renderWithProvider(<WarmUp />, { warmUp: "preset" })

    expect(
      screen.getByText(/Sélectionne un échauffement prédéfinis/i)
    ).toBeInTheDocument()
  })
  it("with preset: render all preset warmUp ", async () => {
    renderWithProvider(<WarmUp />, { warmUp: "preset" })

    expect(screen.getByText(/shadowBoxing/i)).toBeInTheDocument()
    expect(screen.getByText(/course à pied/i)).toBeInTheDocument()
  })
})

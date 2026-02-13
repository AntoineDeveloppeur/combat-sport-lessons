import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Body from "./page"
import { renderWithContext } from "@/__tests__/helpers/renderWithContext"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe("Body page", () => {
  it('click on "ajouter champs" adds an Instruction component', async () => {
    // Arrange
    const user = userEvent.setup()
    renderWithContext(<Body />)

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
})

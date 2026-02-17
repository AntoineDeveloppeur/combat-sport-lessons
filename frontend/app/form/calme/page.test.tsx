import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Confirm from "./page"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe("Confirm page (Retour au calme)", () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('click on "ajouter champs" adds an Instruction component', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Confirm />)

    expect(screen.getByText(/Instruction n°1/i)).toBeInTheDocument()
    expect(screen.queryByText(/Instruction n°2/i)).not.toBeInTheDocument()

    const addButton = screen.getByRole("button", { name: /ajouter un champs/i })
    await user.click(addButton)

    expect(screen.getByText(/Instruction n°1/i)).toBeInTheDocument()
    expect(screen.getByText(/Instruction n°2/i)).toBeInTheDocument()
  })

  it("cannot submit form when instruction text is empty", async () => {
    const user = userEvent.setup()
    renderWithProvider(<Confirm />)

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(
        screen.getByText(/l'instruction doit contenir au moins 3 caractères/i)
      ).toBeInTheDocument()
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("cannot submit form when instruction text is too short (less than 3 characters)", async () => {
    const user = userEvent.setup()
    renderWithProvider(<Confirm />)

    const textareas = screen.getAllByRole("textbox")
    await user.type(textareas[0], "ab")

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(
        screen.getByText(/l'instruction doit contenir au moins 3 caractères/i)
      ).toBeInTheDocument()
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("cannot submit form when minutes are invalid (greater than 90)", async () => {
    const user = userEvent.setup()
    renderWithProvider(<Confirm />)

    const textareas = screen.getAllByRole("textbox")
    await user.type(textareas[0], "Valid instruction text")

    const spinbuttons = screen.getAllByRole("spinbutton")
    const minInput = spinbuttons[0]
    await user.clear(minInput)
    await user.type(minInput, "95")

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(
        screen.getByText(/les minutes ne peuvent pas dépasser 90/i)
      ).toBeInTheDocument()
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("cannot submit form when seconds are invalid (greater than 59)", async () => {
    const user = userEvent.setup()
    renderWithProvider(<Confirm />)

    const textareas = screen.getAllByRole("textbox")
    await user.type(textareas[0], "Valid instruction text")

    const spinbuttons = screen.getAllByRole("spinbutton")
    const secInput = spinbuttons[1]
    await user.clear(secInput)
    await user.type(secInput, "65")

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(
        screen.getByText(/les secondes ne peuvent pas dépasser 59/i)
      ).toBeInTheDocument()
    })

    expect(mockPush).not.toHaveBeenCalled()
  })
})

import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import General from "./page"
import { renderWithContext } from "@/__tests__/helpers/renderWithContext"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe("General page", () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it("cannot submit form when sport is not selected", async () => {
    const user = userEvent.setup()
    renderWithContext(<General />)

    const objectiveTextarea = screen.getByPlaceholderText(
      /exemple : la séance va permettre/i
    )
    await user.type(
      objectiveTextarea,
      "Un objectif valide avec plus de 20 caractères"
    )

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("cannot submit form when objective is empty", async () => {
    const user = userEvent.setup()
    renderWithContext(<General />)

    const sportSelect = screen.getByRole("combobox")
    await user.selectOptions(sportSelect, "Judo")

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("cannot submit form when objective is too short (less than 20 characters)", async () => {
    const user = userEvent.setup()
    renderWithContext(<General />)

    const sportSelect = screen.getByRole("combobox")
    await user.selectOptions(sportSelect, "Judo")

    const objectiveTextarea = screen.getByPlaceholderText(
      /exemple : la séance va permettre/i
    )
    await user.type(objectiveTextarea, "Trop court")

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(
        screen.getByText(/l'objectif doit contenir au moins 20 caractères/i)
      ).toBeInTheDocument()
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("submits form successfully with valid data", async () => {
    const user = userEvent.setup()
    renderWithContext(<General />)

    const sportSelect = screen.getByRole("combobox")
    await user.selectOptions(sportSelect, "Judo")

    const objectiveTextarea = screen.getByPlaceholderText(
      /exemple : la séance va permettre/i
    )
    await user.type(
      objectiveTextarea,
      "Un objectif valide avec plus de 20 caractères pour cette séance"
    )

    const nextButton = screen.getByRole("button", { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/form/echauffement")
    })
  })
})

import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Confirm from "./page"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"

const mockPush = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Crée les objets STABLES une seule fois
const mockQueryResult = {
  data: { lesson: { title: "Leçon test" } },
  isLoading: false,
  error: null,
}

const mockMutationResult = [vi.fn(), { isLoading: false, error: null }]
const mockUpdateMutationResult = [vi.fn(), { isLoading: false, error: null }]

vi.mock("@/store/api/lessonApi", () => ({
  useGetLessonQuery: () => mockQueryResult, // Toujours le même objet
  usePostLessonMutation: () => mockMutationResult, // Toujours le même objet
  useUpdateLessonMutation: () => mockUpdateMutationResult, // Toujours le même objet
}))

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    userId: "user-test",
    saveAuth: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
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
})

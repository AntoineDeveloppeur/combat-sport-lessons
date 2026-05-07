import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LessonsUserPage from "./page"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import * as AuthContext from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"
import { createTiptapJSON } from "@/utils/tiptapHelpers"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

vi.mock("@/store/api/lessonApi", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useGetAllLessonsQuery: vi.fn(),
    useDeleteLessonMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useUpdateLessonMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useDuplicateLessonMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useToggleLessonVisibilityMutation: vi.fn(() => [
      vi.fn(),
      { isLoading: false },
    ]),
  }
})

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}))

describe("LessonsUserPage", () => {
  const mockPush = vi.fn()
  const mockUseRouter = useRouter as ReturnType<typeof vi.fn>
  const mockUseAuth = AuthContext.useAuth as ReturnType<typeof vi.fn>
  const mockUseGetAllLessonsQuery = useGetAllLessonsQuery as ReturnType<
    typeof vi.fn
  >

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRouter.mockReturnValue({ push: mockPush })
  })

  it("should redirect to login if not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      userId: null,
    })

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: null,
      isLoading: false,
    })

    renderWithProvider(<LessonsUserPage />)

    expect(mockPush).toHaveBeenCalledWith("/login")
  })

  it("should render page title and description", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      userId: "user-123",
    })

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: { lessons: [] },
      isLoading: false,
    })

    renderWithProvider(<LessonsUserPage />)

    expect(screen.getByText("Leçons de sport de combat")).toBeInTheDocument()
    expect(
      screen.getByText("Gérez et consultez toutes les leçons")
    ).toBeInTheDocument()
  })

  it("should render create lesson button", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      userId: "user-123",
    })

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: { lessons: [] },
      isLoading: false,
    })

    renderWithProvider(<LessonsUserPage />)

    expect(screen.getByText("Créer une leçon")).toBeInTheDocument()
  })

  it("should dispatch reset action when clicking create lesson button", async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      userId: "user-123",
    })

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: { lessons: [] },
      isLoading: false,
    })

    const { store } = renderWithProvider(<LessonsUserPage />)

    const createButton = screen.getByText("Créer une leçon")
    await user.click(createButton)

    const state = store.getState()
    expect(state.lessonForm.value).toEqual({
      warmUp: "custom",
      coolDown: "custom",
      warmUpInstructions: [{ text: createTiptapJSON(""), min: 1, sec: 0 }],
      bodyInstructions: [{ text: createTiptapJSON(""), min: 1, sec: 0 }],
      coolDownInstructions: [{ text: createTiptapJSON(""), min: 1, sec: 0 }],
    })
  })

  it("should filter lessons to show only user's lessons when 'mine' filter is active", async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      userId: "user-123",
    })

    const mockLessons = [
      {
        id: "1",
        userId: "user-123",
        title: "My Lesson",
        isPublic: false,
      },
      {
        id: "2",
        userId: "other-user",
        title: "Other Lesson",
        isPublic: true,
      },
    ]

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: { lessons: mockLessons },
      isLoading: false,
    })

    renderWithProvider(<LessonsUserPage />)

    const mineButton = screen.getByRole("button", { name: /mes lessons/i })
    await user.click(mineButton)

    expect(screen.getByText("My Lesson")).toBeInTheDocument()
    expect(screen.queryByText("Other Lesson")).not.toBeInTheDocument()
  })

  it("should filter lessons to show only public lessons when 'all' filter is active", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      userId: "user-123",
    })

    const mockLessons = [
      {
        id: "1",
        userId: "user-123",
        title: "My Private Lesson",
        isPublic: false,
      },
      {
        id: "2",
        userId: "other-user",
        title: "Public Lesson",
        isPublic: true,
      },
    ]

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: { lessons: mockLessons },
      isLoading: false,
    })

    renderWithProvider(<LessonsUserPage />)

    expect(screen.queryByText("My Private Lesson")).not.toBeInTheDocument()
    expect(screen.getByText("Public Lesson")).toBeInTheDocument()
  })

  it("should not render table when loading", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      userId: "user-123",
    })

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: null,
      isLoading: true,
    })

    renderWithProvider(<LessonsUserPage />)

    expect(screen.queryByRole("table")).not.toBeInTheDocument()
  })

  it("should render filters component", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      userId: "user-123",
    })

    mockUseGetAllLessonsQuery.mockReturnValue({
      data: { lessons: [] },
      isLoading: false,
    })

    renderWithProvider(<LessonsUserPage />)

    expect(screen.getByText("Créer une leçon")).toBeInTheDocument()
  })
})

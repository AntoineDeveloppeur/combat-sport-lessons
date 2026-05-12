import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SendLessonToBackend from "./SendLessonToBackend"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import type { Lesson } from "@/types"

const mockPush = vi.fn()
const mockUnwrap = vi.fn(() => Promise.resolve({}))
const mockPostLesson = vi.fn(() => ({
  unwrap: mockUnwrap,
}))
const mockUpdateUnwrap = vi.fn(() => Promise.resolve({}))
const mockUpdateLesson = vi.fn(() => ({
  unwrap: mockUpdateUnwrap,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
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

vi.mock("@/store/api/lessonApi", () => ({
  usePostLessonMutation: () => [
    mockPostLesson,
    {
      isLoading: false,
      error: undefined,
    },
  ],
  useUpdateLessonMutation: () => [
    mockUpdateLesson,
    {
      isLoading: false,
      error: undefined,
    },
  ],
}))

describe("SendLessonToBackend", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.alert = vi.fn()
    mockUnwrap.mockResolvedValue({ lessonId: "test-id" })
    mockUpdateUnwrap.mockResolvedValue({ lessonId: "test-id" })
  })

  it("should render save button when not loading and no error", () => {
    renderWithProvider(<SendLessonToBackend />)

    expect(
      screen.getByRole("button", { name: /sauvegarder la leçon/i })
    ).toBeInTheDocument()
  })

  it("should call postLesson with lesson data and token when token exists", async () => {
    const user = userEvent.setup()
    localStorage.setItem("token", "test-token")

    const mockLesson: Lesson = {
      sport: "Karate",
      title: "Test Lesson",
      objective: "Test objective",
      warmUp: "custom",
      coolDown: "custom",
    }

    renderWithProvider(<SendLessonToBackend />, mockLesson)

    const button = screen.getByRole("button", {
      name: /sauvegarder la leçon/i,
    })
    await user.click(button)

    await waitFor(() => {
      expect(mockPostLesson).toHaveBeenCalledWith({
        lesson: expect.objectContaining({
          sport: "Karate",
          title: "Test Lesson",
        }),
        token: "test-token",
      })
    })
  })

  it("should show alert on successful save", async () => {
    const user = userEvent.setup()
    localStorage.setItem("token", "test-token")

    renderWithProvider(<SendLessonToBackend />)

    const button = screen.getByRole("button", {
      name: /sauvegarder la leçon/i,
    })
    await user.click(button)

    await waitFor(
      () => {
        expect(global.alert).toHaveBeenCalledWith(
          "Leçon enregistrée avec succès"
        )
      },
      { timeout: 3000 }
    )
    expect(mockPush).toHaveBeenCalledWith("/lessons/user")
  })

  it("should be accessible", () => {
    renderWithProvider(<SendLessonToBackend />)

    const button = screen.getByRole("button")
    expect(button).toBeEnabled()
    expect(button).toBeVisible()
  })
})

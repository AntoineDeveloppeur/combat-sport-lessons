import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SendLessonToBackend from "./SendLessonToBackend"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import type { Lesson } from "@/types"

const mockPush = vi.fn()
const mockPostLesson = vi.fn(() =>
  Promise.resolve({ unwrap: () => Promise.resolve({}) }),
)

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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
}))

describe("SendLessonToBackend", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.alert = vi.fn()
  })

  it("should render save button when not loading and no error", () => {
    renderWithProvider(<SendLessonToBackend />)

    expect(
      screen.getByRole("button", { name: /sauvegarder la lesson/i }),
    ).toBeInTheDocument()
  })

  it("should redirect to login when no token is present", async () => {
    const user = userEvent.setup()
    renderWithProvider(<SendLessonToBackend />)

    const button = screen.getByRole("button", {
      name: /sauvegarder la lesson/i,
    })
    await user.click(button)

    expect(mockPush).toHaveBeenCalledWith("/login")
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

    mockPostLesson.mockResolvedValue({ unwrap: vi.fn().mockResolvedValue({}) })

    renderWithProvider(<SendLessonToBackend />, mockLesson)

    const button = screen.getByRole("button", {
      name: /sauvegarder la lesson/i,
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

    mockPostLesson.mockResolvedValue({ unwrap: vi.fn().mockResolvedValue({}) })

    renderWithProvider(<SendLessonToBackend />)

    const button = screen.getByRole("button", {
      name: /sauvegarder la lesson/i,
    })
    await user.click(button)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Lesson Enregistrée")
    })
  })

  it("should be accessible", () => {
    renderWithProvider(<SendLessonToBackend />)

    const button = screen.getByRole("button")
    expect(button).toBeEnabled()
    expect(button).toBeVisible()
  })
})

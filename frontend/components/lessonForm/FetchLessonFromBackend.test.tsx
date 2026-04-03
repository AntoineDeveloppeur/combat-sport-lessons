import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import FetchLessonFromBackend from "./FetchLessonFromBackend"
import { lessonFormSlice } from "@/features/lessonForm/lessonFormSlice"

const mockData = {
  lesson: {
    lessonId: "550e8400-e29b-41d4-a716-446655440011",
    title: "Test Lesson",
    sport: "Karate",
    objective: "Test objective",
  },
}

const mockUseGetLessonQuery = vi.fn()

vi.mock("@/store/api/lessonApi", () => ({
  useGetLessonQuery: (id: string, options: { skip: boolean }) =>
    mockUseGetLessonQuery(id, options),
}))

describe("FetchLessonFromBackend", () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        lessonForm: lessonFormSlice.reducer,
      },
    })
  }

  const renderWithStore = (store = createTestStore()) => {
    return render(
      <Provider store={store}>
        <FetchLessonFromBackend />
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGetLessonQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    })
  })

  it("should render fetch button", () => {
    renderWithStore()

    expect(screen.getByRole("button", { name: /récupérer la lesson/i })).toBeInTheDocument()
  })

  it("should not fetch on initial render", () => {
    renderWithStore()

    expect(mockUseGetLessonQuery).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440011",
      { skip: true }
    )
  })

  it("should fetch lesson when button is clicked", async () => {
    const user = userEvent.setup()
    mockUseGetLessonQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    })

    renderWithStore()

    const button = screen.getByRole("button", { name: /récupérer la lesson/i })
    await user.click(button)

    await waitFor(() => {
      expect(mockUseGetLessonQuery).toHaveBeenCalledWith(
        "550e8400-e29b-41d4-a716-446655440011",
        { skip: false }
      )
    })
  })

  it("should display lesson title when data is fetched", async () => {
    mockUseGetLessonQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    })

    renderWithStore()

    await waitFor(() => {
      expect(screen.getByText(/leçon récupérée : test lesson/i)).toBeInTheDocument()
    })
  })

  it("should show loading state when fetching", () => {
    mockUseGetLessonQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    renderWithStore()

    expect(screen.getByRole("button", { name: /chargement/i })).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("should display error message when fetch fails", () => {
    mockUseGetLessonQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: "Network error" },
    })

    renderWithStore()

    expect(screen.getByText(/erreur : network error/i)).toBeInTheDocument()
  })

  it("should dispatch save action when data is fetched", async () => {
    const store = createTestStore()
    const dispatchSpy = vi.spyOn(store, "dispatch")

    mockUseGetLessonQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    })

    render(
      <Provider store={store}>
        <FetchLessonFromBackend />
      </Provider>
    )

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "lessonForm/save",
          payload: expect.objectContaining({
            title: "Test Lesson",
            sport: "Karate",
          }),
        })
      )
    })
  })

  it("should be accessible", () => {
    renderWithStore()

    const button = screen.getByRole("button")
    expect(button).toBeEnabled()
    expect(button).toBeVisible()
  })

  it("should handle multiple clicks", async () => {
    const user = userEvent.setup()
    renderWithStore()

    const button = screen.getByRole("button", { name: /récupérer la lesson/i })
    
    await user.click(button)
    await user.click(button)

    expect(mockUseGetLessonQuery).toHaveBeenCalled()
  })

  it("should not display lesson info when no data", () => {
    renderWithStore()

    expect(screen.queryByText(/leçon récupérée/i)).not.toBeInTheDocument()
  })

  it("should not display error when no error", () => {
    renderWithStore()

    expect(screen.queryByText(/erreur/i)).not.toBeInTheDocument()
  })
})

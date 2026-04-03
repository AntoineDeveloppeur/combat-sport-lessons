import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LessonActions } from "./LessonActions"
import type { Lesson } from "@/types"

const mockPush = vi.fn()
const mockDeleteLesson = vi.fn()
const mockDuplicateLesson = vi.fn()
const mockToggleVisibility = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock("@/store/api/lessonApi", () => ({
  useDeleteLessonMutation: () => [mockDeleteLesson, {}],
  useDuplicateLessonMutation: () => [mockDuplicateLesson, {}],
  useToggleLessonVisibilityMutation: () => [mockToggleVisibility, {}],
}))

vi.mock("@/utils/buildAndDownloadPdf", () => ({
  buildAndDownloadPdf: vi.fn(),
}))

describe("LessonActions", () => {
  const mockLesson: Lesson = {
    lessonId: "lesson-123",
    title: "Test Lesson",
    sport: "Karate",
    objective: "Test objective",
    isPublic: false,
    userId: "user-123",
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.alert = vi.fn()
    global.confirm = vi.fn(() => true)
  })

  describe("Rendering", () => {
    it("should render dropdown menu trigger button", () => {
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("should show owner actions when isOwner is true", async () => {
      const user = userEvent.setup()
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.getByText(/modifier/i)).toBeInTheDocument()
      expect(
        screen.getByText(/rendre privée|rendre publique/i),
      ).toBeInTheDocument()
      expect(screen.getByText(/supprimer/i)).toBeInTheDocument()
    })

    it("should not show owner actions when isOwner is false", async () => {
      const user = userEvent.setup()
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={false}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.queryByText(/modifier/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/supprimer/i)).not.toBeInTheDocument()
    })

    it("should always show duplicate and download actions", async () => {
      const user = userEvent.setup()
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={false}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.getByText(/dupliquer/i)).toBeInTheDocument()
      expect(screen.getByText(/télécharger/i)).toBeInTheDocument()
    })

    it("should show 'Rendre publique' when lesson is private", async () => {
      const user = userEvent.setup()
      const privateLesson = { ...mockLesson, isPublic: false }
      render(
        <LessonActions
          lesson={privateLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.getByText(/rendre publique/i)).toBeInTheDocument()
    })

    it("should show 'Rendre privée' when lesson is public", async () => {
      const user = userEvent.setup()
      const publicLesson = { ...mockLesson, isPublic: true }
      render(
        <LessonActions
          lesson={publicLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      expect(screen.getByText(/rendre privée/i)).toBeInTheDocument()
    })
  })

  describe("Edit action", () => {
    it("should navigate to edit page when edit is clicked", async () => {
      const user = userEvent.setup()
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const editButton = screen.getByText(/modifier/i)
      await user.click(editButton)

      expect(mockPush).toHaveBeenCalledWith("/form/lesson-123")
    })
  })

  describe("Delete action", () => {
    it("should show confirmation dialog when delete is clicked", async () => {
      const user = userEvent.setup()
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const deleteButton = screen.getByText(/supprimer/i)
      await user.click(deleteButton)

      expect(global.confirm).toHaveBeenCalledWith(
        "Êtes-vous sûr de vouloir supprimer cette lesson ?",
      )
    })

    it("should call deleteLesson when confirmed", async () => {
      const user = userEvent.setup()
      mockDeleteLesson.mockResolvedValue({
        unwrap: vi.fn().mockResolvedValue({}),
      })

      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const deleteButton = screen.getByText(/supprimer/i)
      await user.click(deleteButton)

      await waitFor(() => {
        expect(mockDeleteLesson).toHaveBeenCalledWith("lesson-123")
      })
    })

    it("should not delete when confirmation is cancelled", async () => {
      const user = userEvent.setup()
      global.confirm = vi.fn(() => false)

      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const deleteButton = screen.getByText(/supprimer/i)
      await user.click(deleteButton)

      expect(mockDeleteLesson).not.toHaveBeenCalled()
    })

    it("should show alert on delete error", async () => {
      const user = userEvent.setup()
      mockDeleteLesson.mockRejectedValue(new Error("Delete failed"))

      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const deleteButton = screen.getByText(/supprimer/i)
      await user.click(deleteButton)

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Erreur lors de la suppression de la lesson",
        )
      })
    })
  })

  describe("Duplicate action", () => {
    it("should call duplicateLesson when clicked", async () => {
      const user = userEvent.setup()
      mockDuplicateLesson.mockResolvedValue({
        unwrap: vi.fn().mockResolvedValue({}),
      })

      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={false}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const duplicateButton = screen.getByText(/dupliquer/i)
      await user.click(duplicateButton)

      await waitFor(() => {
        expect(mockDuplicateLesson).toHaveBeenCalledWith(mockLesson)
      })
    })

    it("should show alert on duplicate error", async () => {
      const user = userEvent.setup()
      mockDuplicateLesson.mockRejectedValue(new Error("Duplicate failed"))

      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={false}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const duplicateButton = screen.getByText(/dupliquer/i)
      await user.click(duplicateButton)

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Erreur lors de la duplication de la lesson",
        )
      })
    })
  })

  describe("Toggle visibility action", () => {
    it("should require authentication token", async () => {
      const user = userEvent.setup()
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const visibilityButton = screen.getByText(/rendre publique/i)
      await user.click(visibilityButton)

      expect(global.alert).toHaveBeenCalledWith(
        "Vous devez être connecté pour modifier la visibilité",
      )
      expect(mockToggleVisibility).not.toHaveBeenCalled()
    })

    it("should call toggleVisibility with token when authenticated", async () => {
      const user = userEvent.setup()
      localStorage.setItem("token", "test-token")
      mockToggleVisibility.mockResolvedValue({
        unwrap: vi.fn().mockResolvedValue({}),
      })

      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const visibilityButton = screen.getByText(/rendre publique/i)
      await user.click(visibilityButton)

      await waitFor(() => {
        expect(mockToggleVisibility).toHaveBeenCalledWith({
          lessonId: "lesson-123",
          token: "test-token",
        })
      })
    })

    it("should show alert on visibility toggle error", async () => {
      const user = userEvent.setup()
      localStorage.setItem("token", "test-token")
      mockToggleVisibility.mockRejectedValue(new Error("Toggle failed"))

      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const trigger = screen.getByRole("button")
      await user.click(trigger)

      const visibilityButton = screen.getByText(/rendre publique/i)
      await user.click(visibilityButton)

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Erreur lors du changement de visibilité de la lesson",
        )
      })
    })
  })

  describe("Accessibility", () => {
    it("should be keyboard navigable", async () => {
      const user = userEvent.setup()
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      await user.tab()
      expect(screen.getByRole("button")).toHaveFocus()
    })

    it("should have accessible button", () => {
      render(
        <LessonActions
          lesson={mockLesson}
          isOwner={true}
        />,
      )

      const button = screen.getByRole("button")
      expect(button).toBeEnabled()
      expect(button).toBeVisible()
    })
  })
})

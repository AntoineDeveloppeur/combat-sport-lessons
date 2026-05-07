import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LessonFilters } from "./LessonFilters"

describe("LessonFilters", () => {
  const mockOnFilterChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("should render both filter buttons", () => {
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      expect(
        screen.getByRole("button", { name: /mes lessons/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /toutes les lessons/i })
      ).toBeInTheDocument()
    })

    it("should highlight 'mine' button when activeFilter is 'mine'", () => {
      render(
        <LessonFilters
          activeFilter="mine"
          onFilterChange={mockOnFilterChange}
        />
      )

      const mineButton = screen.getByRole("button", { name: /mes lessons/i })
      const allButton = screen.getByRole("button", {
        name: /toutes les lessons/i,
      })

      expect(mineButton).toHaveAttribute("data-variant", "default")
      expect(allButton).toHaveAttribute("data-variant", "outline")
    })

    it("should highlight 'all' button when activeFilter is 'all'", () => {
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const mineButton = screen.getByRole("button", { name: /mes lessons/i })
      const allButton = screen.getByRole("button", {
        name: /toutes les lessons/i,
      })

      expect(mineButton).toHaveAttribute("data-variant", "outline")
      expect(allButton).toHaveAttribute("data-variant", "default")
    })
  })

  describe("Interactions", () => {
    it("should call onFilterChange with 'mine' when 'Mes lessons' is clicked", async () => {
      const user = userEvent.setup()
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const mineButton = screen.getByRole("button", { name: /mes lessons/i })
      await user.click(mineButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith("mine")
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1)
    })

    it("should call onFilterChange with 'all' when 'Toutes les lessons' is clicked", async () => {
      const user = userEvent.setup()
      render(
        <LessonFilters
          activeFilter="mine"
          onFilterChange={mockOnFilterChange}
        />
      )

      const allButton = screen.getByRole("button", {
        name: /toutes les lessons/i,
      })
      await user.click(allButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith("all")
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1)
    })

    it("should allow clicking the same filter multiple times", async () => {
      const user = userEvent.setup()
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const allButton = screen.getByRole("button", {
        name: /toutes les lessons/i,
      })
      await user.click(allButton)
      await user.click(allButton)

      expect(mockOnFilterChange).toHaveBeenCalledTimes(2)
      expect(mockOnFilterChange).toHaveBeenCalledWith("all")
    })

    it("should switch between filters", async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const mineButton = screen.getByRole("button", { name: /mes lessons/i })
      await user.click(mineButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith("mine")

      rerender(
        <LessonFilters
          activeFilter="mine"
          onFilterChange={mockOnFilterChange}
        />
      )

      const allButton = screen.getByRole("button", {
        name: /toutes les lessons/i,
      })
      await user.click(allButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith("all")
    })
  })

  describe("Styling", () => {
    it("should have correct button sizes", () => {
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const buttons = screen.getAllByRole("button")
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("data-size", "lg")
      })
    })

    it("should have gap between buttons", () => {
      const { container } = render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const filterContainer = container.firstChild
      expect(filterContainer).toHaveClass("gap-2")
    })

    it("should have margin bottom", () => {
      const { container } = render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const filterContainer = container.firstChild
      expect(filterContainer).toHaveClass("mb-6")
    })
  })

  describe("Accessibility", () => {
    it("should have accessible button labels", () => {
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      expect(screen.getByRole("button", { name: /mes lessons/i })).toBeEnabled()
      expect(
        screen.getByRole("button", { name: /toutes les lessons/i })
      ).toBeEnabled()
    })

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup()
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      await user.tab()
      expect(screen.getByRole("button", { name: /mes lessons/i })).toHaveFocus()

      await user.tab()
      expect(
        screen.getByRole("button", { name: /toutes les lessons/i })
      ).toHaveFocus()
    })

    it("should trigger on Enter key", async () => {
      const user = userEvent.setup()
      render(
        <LessonFilters activeFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const mineButton = screen.getByRole("button", { name: /mes lessons/i })
      mineButton.focus()
      await user.keyboard("{Enter}")

      expect(mockOnFilterChange).toHaveBeenCalledWith("mine")
    })
  })
})

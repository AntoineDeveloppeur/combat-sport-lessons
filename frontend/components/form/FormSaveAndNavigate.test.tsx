import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FormSaveAndNavigate from "./FormSaveAndNavigate"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import * as NextNavigation from "next/navigation"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

describe("FormSaveAndNavigate", () => {
  const mockPush = vi.fn()
  const mockHandleSubmit = vi.fn((onValid) => async () => {
    onValid({})
  })

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(NextNavigation.useRouter).mockReturnValue({
      push: mockPush,
    } as Partial<AppRouterInstance> as AppRouterInstance)
  })

  it("should render container div with correct classes", () => {
    const { container } = renderWithProvider(
      <FormSaveAndNavigate
        handleSubmit={mockHandleSubmit}
        prev="/prev"
        next="/next"
      />
    )
    const div = container.querySelector("div")
    expect(div).toHaveClass("flex", "justify-between", "w-full")
  })

  it("should render Prev button when prev prop is provided", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} prev="/prev" />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })
    expect(prevButton).toBeInTheDocument()
  })

  it("should render Next button when next prop is provided", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} next="/next" />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toBeInTheDocument()
  })

  it("should not render Prev button when prev prop is not provided", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} next="/next" />
    )
    const prevButton = screen.queryByRole("button", { name: /prev/i })
    expect(prevButton).not.toBeInTheDocument()
  })

  it("should not render Next button when next prop is not provided", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} prev="/prev" />
    )
    const nextButton = screen.queryByRole("button", { name: /next/i })
    expect(nextButton).not.toBeInTheDocument()
  })

  it("should render both buttons when both props are provided", () => {
    renderWithProvider(
      <FormSaveAndNavigate
        handleSubmit={mockHandleSubmit}
        prev="/prev"
        next="/next"
      />
    )
    expect(screen.getByRole("button", { name: /prev/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument()
  })

  it("should render no buttons when no props are provided", () => {
    renderWithProvider(<FormSaveAndNavigate handleSubmit={mockHandleSubmit} />)
    const buttons = screen.queryAllByRole("button")
    expect(buttons).toHaveLength(0)
  })

  it("should have type button on Prev button", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} prev="/prev" />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })
    expect(prevButton).toHaveAttribute("type", "button")
  })

  it("should have type button on Next button", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} next="/next" />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toHaveAttribute("type", "button")
  })

  it("should call handleSubmit when Prev button is clicked", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} prev="/prev" />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })

    await user.click(prevButton)

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it("should call handleSubmit when Next button is clicked", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} next="/next" />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })

    await user.click(nextButton)

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it("should navigate to prev route when Prev button is clicked", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate
        handleSubmit={mockHandleSubmit}
        prev="/form/general"
      />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })

    await user.click(prevButton)

    expect(mockPush).toHaveBeenCalledWith("/form/general")
  })

  it("should navigate to next route when Next button is clicked", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate
        handleSubmit={mockHandleSubmit}
        next="/form/echauffement"
      />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })

    await user.click(nextButton)

    expect(mockPush).toHaveBeenCalledWith("/form/echauffement")
  })

  it("should dispatch save action when Prev button is clicked and validation succeeds", async () => {
    const user = userEvent.setup()
    const customHandleSubmit = vi.fn((onValid) => async () => {
      onValid({ test: "data" })
    })

    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={customHandleSubmit} prev="/prev" />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })

    await user.click(prevButton)

    expect(customHandleSubmit).toHaveBeenCalled()
  })

  it("should dispatch save action when Next button is clicked and validation succeeds", async () => {
    const user = userEvent.setup()
    const customHandleSubmit = vi.fn((onValid) => async () => {
      onValid({ test: "data" })
    })

    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={customHandleSubmit} next="/next" />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })

    await user.click(nextButton)

    expect(customHandleSubmit).toHaveBeenCalled()
  })

  it("should display < symbol in Prev button", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} prev="/prev" />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })
    expect(prevButton).toHaveTextContent("<")
  })

  it("should display > symbol in Next button", () => {
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} next="/next" />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })
    expect(nextButton).toHaveTextContent(">")
  })

  it("should navigate with correct route for Prev when validation succeeds", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate
        handleSubmit={mockHandleSubmit}
        prev="/custom/route"
      />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })

    await user.click(prevButton)

    expect(mockPush).toHaveBeenCalledWith("/custom/route")
  })

  it("should navigate with correct route for Next when validation succeeds", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate
        handleSubmit={mockHandleSubmit}
        next="/another/route"
      />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })

    await user.click(nextButton)

    expect(mockPush).toHaveBeenCalledWith("/another/route")
  })

  it("should handle multiple clicks on Prev button", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} prev="/prev" />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })

    await user.click(prevButton)
    await user.click(prevButton)
    await user.click(prevButton)

    expect(mockHandleSubmit).toHaveBeenCalledTimes(3)
    expect(mockPush).toHaveBeenCalledTimes(3)
  })

  it("should handle multiple clicks on Next button", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={mockHandleSubmit} next="/next" />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })

    await user.click(nextButton)
    await user.click(nextButton)

    expect(mockHandleSubmit).toHaveBeenCalledTimes(2)
    expect(mockPush).toHaveBeenCalledTimes(2)
  })

  it("should not navigate when validation fails on Prev button click", async () => {
    const user = userEvent.setup()
    const failingHandleSubmit = vi.fn(() => async () => {
      // onValid callback is never called, simulating validation failure
    })

    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={failingHandleSubmit} prev="/prev" />
    )
    const prevButton = screen.getByRole("button", { name: /prev/i })

    await user.click(prevButton)

    expect(failingHandleSubmit).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("should not navigate when validation fails on Next button click", async () => {
    const user = userEvent.setup()
    const failingHandleSubmit = vi.fn(() => async () => {
      // onValid callback is never called, simulating validation failure
    })

    renderWithProvider(
      <FormSaveAndNavigate handleSubmit={failingHandleSubmit} next="/next" />
    )
    const nextButton = screen.getByRole("button", { name: /next/i })

    await user.click(nextButton)

    expect(failingHandleSubmit).toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })
})

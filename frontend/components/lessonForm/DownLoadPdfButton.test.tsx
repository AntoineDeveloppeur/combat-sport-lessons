import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import DownLoadPdfButton from "./DownLoadPdfButton"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import * as buildAndDownloadPdfModule from "@/utils/buildAndDownloadPdf"
import type { Lesson } from "@/types"

vi.mock("@/utils/buildAndDownloadPdf", () => ({
  buildAndDownloadPdf: vi.fn(),
}))

describe("DownLoadPdfButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render button with correct text", () => {
    renderWithProvider(<DownLoadPdfButton />)

    expect(
      screen.getByRole("button", { name: /télécharge la lesson/i }),
    ).toBeInTheDocument()
  })

  it("should call buildAndDownloadPdf with lesson data when clicked", async () => {
    const user = userEvent.setup()
    const mockLesson: Lesson = {
      sport: "Karate",
      title: "Test Lesson",
      objective: "Test objective",
      warmUp: "custom",
      coolDown: "custom",
    }

    renderWithProvider(<DownLoadPdfButton />, mockLesson)

    const button = screen.getByRole("button", { name: /télécharge la lesson/i })
    await user.click(button)

    expect(buildAndDownloadPdfModule.buildAndDownloadPdf).toHaveBeenCalledTimes(
      1,
    )
    expect(buildAndDownloadPdfModule.buildAndDownloadPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        sport: "Karate",
        title: "Test Lesson",
        objective: "Test objective",
      }),
    )
  })

  it("should work with minimal lesson data", async () => {
    const user = userEvent.setup()
    const minimalLesson: Lesson = {
      warmUp: "custom",
      coolDown: "custom",
    }

    renderWithProvider(<DownLoadPdfButton />, minimalLesson)

    const button = screen.getByRole("button")
    await user.click(button)

    expect(buildAndDownloadPdfModule.buildAndDownloadPdf).toHaveBeenCalledTimes(
      1,
    )
  })

  it("should work with complete lesson data including instructions", async () => {
    const user = userEvent.setup()
    const completeLesson: Lesson = {
      sport: "Boxing",
      title: "Advanced Training",
      objective: "Improve technique",
      warmUp: "custom",
      coolDown: "custom",
      warmUpInstructions: [
        { text: "Warm up 1", min: 5, sec: 0 },
        { text: "Warm up 2", min: 3, sec: 30 },
      ],
      bodyInstructions: [{ text: "Body 1", min: 10, sec: 0 }],
      coolDownInstructions: [{ text: "Cool down 1", min: 5, sec: 0 }],
      duration: 1410,
    }

    renderWithProvider(<DownLoadPdfButton />, completeLesson)

    const button = screen.getByRole("button")
    await user.click(button)

    expect(buildAndDownloadPdfModule.buildAndDownloadPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        sport: "Boxing",
        warmUpInstructions: expect.arrayContaining([
          expect.objectContaining({ text: "Warm up 1" }),
        ]),
      }),
    )
  })

  it("should handle multiple clicks", async () => {
    const user = userEvent.setup()
    renderWithProvider(<DownLoadPdfButton />)

    const button = screen.getByRole("button")

    await user.click(button)
    await user.click(button)
    await user.click(button)

    expect(buildAndDownloadPdfModule.buildAndDownloadPdf).toHaveBeenCalledTimes(
      3,
    )
  })

  it("should be accessible", () => {
    renderWithProvider(<DownLoadPdfButton />)

    const button = screen.getByRole("button")
    expect(button).toBeEnabled()
    expect(button).toBeVisible()
  })
})

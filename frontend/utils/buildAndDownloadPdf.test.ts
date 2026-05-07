/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { buildAndDownloadPdf } from "./buildAndDownloadPdf"
import { mockLesson } from "@/data/mockLesson"
import * as reactPdf from "@react-pdf/renderer"

vi.mock("@react-pdf/renderer", async () => {
  const actual = await vi.importActual("@react-pdf/renderer")
  return {
    ...actual,
    pdf: vi.fn(),
  }
})

vi.mock("@/components/pdf/LessonPdfDocument", () => ({
  LessonPdfDocument: () => null,
}))

describe("buildAndDownloadPdf", () => {
  let mockBlob: Blob
  let mockToBlob: ReturnType<typeof vi.fn>
  let mockCreateObjectURL: ReturnType<typeof vi.fn>
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>
  let mockClick: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockBlob = new Blob(["test"], { type: "application/pdf" })
    mockToBlob = vi.fn().mockResolvedValue(mockBlob)
    mockCreateObjectURL = vi.fn().mockReturnValue("blob:mock-url")
    mockRevokeObjectURL = vi.fn()
    mockClick = vi.fn()

    vi.mocked(reactPdf.pdf).mockReturnValue({
      toBlob: mockToBlob,
    } as any)

    global.URL.createObjectURL = mockCreateObjectURL
    global.URL.revokeObjectURL = mockRevokeObjectURL

    vi.spyOn(document, "createElement").mockReturnValue({
      click: mockClick,
      href: "",
      download: "",
    } as any)
  })

  it("should generate PDF blob using @react-pdf/renderer", async () => {
    await buildAndDownloadPdf(mockLesson)

    expect(reactPdf.pdf).toHaveBeenCalled()
    expect(mockToBlob).toHaveBeenCalled()
  })

  it("should create download link and trigger download", async () => {
    await buildAndDownloadPdf(mockLesson)

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
    expect(document.createElement).toHaveBeenCalledWith("a")
    expect(mockClick).toHaveBeenCalled()
  })

  it("should revoke object URL after download", async () => {
    await buildAndDownloadPdf(mockLesson)

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url")
  })

  it("should use lesson sport in filename", async () => {
    await buildAndDownloadPdf(mockLesson)

    const link = vi.mocked(document.createElement).mock.results[0].value
    expect(link.download).toBe("lesson-Arnis.pdf")
  })
})

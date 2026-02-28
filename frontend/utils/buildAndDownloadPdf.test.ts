import { describe, it, expect, vi, beforeEach } from "vitest"
import { buildAndDownloadPdf } from "./buildAndDownloadPdf"
import { jsPDF } from "jspdf"
import { mockLesson } from "@/data/mockLesson"

vi.mock("jspdf", () => ({
  jsPDF: vi.fn(),
}))

describe("buildAndDownloadPdf", () => {
  let mockDoc: {
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } }
    setFontSize: ReturnType<typeof vi.fn>
    rect: ReturnType<typeof vi.fn>
    setFont: ReturnType<typeof vi.fn>
    text: ReturnType<typeof vi.fn>
    splitTextToSize: ReturnType<typeof vi.fn>
    addPage: ReturnType<typeof vi.fn>
    save: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockDoc = {
      internal: {
        pageSize: {
          getWidth: vi.fn(() => 210),
          getHeight: vi.fn(() => 297),
        },
      },
      setFontSize: vi.fn(),
      rect: vi.fn(),
      setFont: vi.fn(),
      text: vi.fn(),
      splitTextToSize: vi.fn((text: string) => [text]),
      addPage: vi.fn(),
      save: vi.fn(),
    }

    vi.mocked(jsPDF).mockImplementation(function (this: unknown) {
      return mockDoc as unknown as jsPDF
    } as unknown as typeof jsPDF)
  })

  it("should create a jsPDF instance", () => {
    buildAndDownloadPdf(mockLesson)

    expect(jsPDF).toHaveBeenCalled()
  })

  it("should save the PDF with the correct filename", () => {
    buildAndDownloadPdf(mockLesson)

    expect(mockDoc.save).toHaveBeenCalledWith("lesson.pdf")
  })
})

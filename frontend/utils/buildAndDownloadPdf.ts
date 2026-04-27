import { jsPDF } from "jspdf"
import { Lesson, InstructionType } from "@/types"
import { tiptapToPlainText } from "./tiptapToPlainText"

export const buildAndDownloadPdf = (lesson: Lesson): void => {
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  let yPosition = margin

  doc.setFontSize(10)

  doc.rect(margin, yPosition, contentWidth, 20)
  yPosition += 5

  doc.setFont("helvetica", "bold")
  doc.text(`Sport : ${lesson.sport || "Non spécifié"}`, margin + 5, yPosition)
  yPosition += 7

  doc.setFont("helvetica", "normal")
  const objectiveLines = doc.splitTextToSize(
    `Objectif : ${lesson.objective || "Non spécifié"}`,
    contentWidth - 10,
  )
  doc.text(objectiveLines, margin + 5, yPosition)
  yPosition += 25

  const columnInstructionX = margin
  const columnTimeX = pageWidth - margin - 30
  const columnWidth = columnTimeX - columnInstructionX - 5

  const addSection = (
    title: string,
    instructions?: InstructionType[],
  ): void => {
    if (yPosition > pageHeight - 30) {
      doc.addPage()
      yPosition = margin
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    const titleHeight = 10
    doc.rect(columnInstructionX, yPosition, contentWidth, titleHeight)
    doc.text(title, columnInstructionX + 5, yPosition + 7)
    yPosition += titleHeight + 5

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    if (!instructions || instructions.length === 0) {
      return
    }

    instructions.forEach((instruction) => {
      const timeText = `${instruction.min}:${instruction.sec.toString().padStart(2, "0")}`

      const plainText = tiptapToPlainText(instruction.text)
      const instructionLines = doc.splitTextToSize(
        plainText || "",
        columnWidth - 10,
      )

      const lineHeight = 7
      const sectionHeight = instructionLines.length * lineHeight + 4

      if (yPosition + sectionHeight > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
      }

      doc.text(instructionLines, columnInstructionX + 5, yPosition + 5)

      doc.text(timeText, columnTimeX + 5, yPosition + 5)

      yPosition += sectionHeight
    })
  }

  addSection("Échauffement", lesson.warmUpInstructions)

  addSection("Corps de séance", lesson.bodyInstructions)

  addSection("Retour au calme", lesson.coolDownInstructions)

  doc.save("lesson.pdf")
}

import React from "react"
import { Document, Page, Text, View } from "@react-pdf/renderer"
import type { Lesson, InstructionType } from "@/types"
import { renderTiptapContent } from "@/utils/tiptapToReactPdf"
import { pdfStyles } from "./pdfStyles"

interface LessonPdfDocumentProps {
  lesson: Lesson
}

interface SectionProps {
  title: string
  instructions?: InstructionType[]
}

const Section: React.FC<SectionProps> = ({ title, instructions }) => {
  return (
    <View style={pdfStyles.section}>
      <Text style={pdfStyles.sectionTitle}>{title}</Text>

      {!instructions || instructions.length === 0 ? (
        <Text style={pdfStyles.emptySection}>Aucune instruction</Text>
      ) : (
        instructions.map((instruction, index) => (
          <View key={index} style={pdfStyles.instructionContainer}>
            <View style={pdfStyles.instructionRow}>
              <View style={pdfStyles.instructionContent}>
                {renderTiptapContent(instruction.text)}
              </View>
              <View style={pdfStyles.timeContainer}>
                <Text style={pdfStyles.timeText}>
                  {instruction.min}:
                  {instruction.sec.toString().padStart(2, "0")}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  )
}

export const LessonPdfDocument: React.FC<LessonPdfDocumentProps> = ({
  lesson,
}) => {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.sportText}>
            Sport : {lesson.sport || "Non spécifié"}
          </Text>
          <Text style={pdfStyles.objectiveLabel}>Objectif :</Text>
          <Text style={pdfStyles.objectiveText}>
            {lesson.objective || "Non spécifié"}
          </Text>
        </View>

        <Section
          title="Échauffement"
          instructions={lesson.warmUpInstructions}
        />
        <Section
          title="Corps de séance"
          instructions={lesson.bodyInstructions}
        />
        <Section
          title="Retour au calme"
          instructions={lesson.coolDownInstructions}
        />

        <Text
          style={pdfStyles.footer}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}

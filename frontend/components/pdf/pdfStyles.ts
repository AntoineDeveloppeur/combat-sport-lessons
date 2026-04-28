import { StyleSheet } from "@react-pdf/renderer"

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    borderLeft: "4pt solid #3b82f6",
  },
  sportText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
  },
  objectiveLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 3,
  },
  objectiveText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#3b82f6",
    padding: "8pt 12pt",
    marginBottom: 10,
    borderRadius: 3,
  },
  instructionContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 3,
    borderLeft: "2pt solid #e5e7eb",
  },
  instructionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  instructionContent: {
    flex: 1,
    marginRight: 10,
  },
  timeContainer: {
    minWidth: 50,
    textAlign: "right",
    paddingTop: 2,
  },
  timeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#3b82f6",
    backgroundColor: "#eff6ff",
    padding: "4pt 8pt",
    borderRadius: 3,
  },
  emptySection: {
    fontSize: 9,
    color: "#9ca3af",
    fontStyle: "italic",
    padding: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "1pt solid #e5e7eb",
    paddingTop: 10,
  },
  pageNumber: {
    fontSize: 8,
    color: "#6b7280",
  },
})

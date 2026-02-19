/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import CustomInstructions from "./CustomInstructions"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Lesson } from "@/types"

vi.mock("@/hooks/useInstructionForm")

describe("CustomInstructions", () => {
  const mockRegister: UseFormRegister<Lesson> = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }))

  const mockAddInstruction = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render one instruction", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    expect(screen.getByText("Instruction n°1")).toBeInTheDocument()
    expect(screen.queryByText("Instruction n°2")).not.toBeInTheDocument()
  })

  it("should render four instructions", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: "", min: 1, sec: 0 },
        { id: "2", text: "", min: 1, sec: 0 },
        { id: "3", text: "", min: 1, sec: 0 },
        { id: "4", text: "", min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    expect(screen.getByText("Instruction n°1")).toBeInTheDocument()
    expect(screen.getByText("Instruction n°2")).toBeInTheDocument()
    expect(screen.getByText("Instruction n°3")).toBeInTheDocument()
    expect(screen.getByText("Instruction n°4")).toBeInTheDocument()
  })

  it("should add an instruction when button is clicked", async () => {
    const user = userEvent.setup()

    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    const addButton = screen.getByRole("button", { name: /ajouter un champs/i })
    await user.click(addButton)

    expect(mockAddInstruction).toHaveBeenCalledTimes(1)
  })

  it("should contain a field legend", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    const legend = document.querySelector("legend")
    expect(legend).toBeInTheDocument()
  })

  it("errors should be passed to Instruction", () => {
    const mockErrors: FieldErrors<Lesson> = {
      warmUpInstructions: [
        {
          text: { message: "Text is required", type: "required" },
        },
      ],
    }

    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: mockErrors,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    expect(screen.getByText("Text is required")).toBeInTheDocument()
  })

  it("index should be passed to Instruction", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: "", min: 1, sec: 0 },
        { id: "2", text: "", min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    expect(screen.getByText("Instruction n°1")).toBeInTheDocument()
    expect(screen.getByText("Instruction n°2")).toBeInTheDocument()
  })

  it("register should be passed to Instruction", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    expect(mockRegister).toHaveBeenCalledWith("warmUpInstructions.0.text")
    expect(mockRegister).toHaveBeenCalledWith("warmUpInstructions.0.min")
    expect(mockRegister).toHaveBeenCalledWith("warmUpInstructions.0.sec")
  })

  it("fieldLegend should display the legend prop", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions
        legend="Custom legend text"
        lessonKey="warmUpInstructions"
      />
    )

    expect(screen.getByText("Custom legend text")).toBeInTheDocument()
  })

  it("should render the add button with correct text", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    const addButton = screen.getByRole("button", { name: /ajouter un champs/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveAttribute("type", "button")
  })

  it("should call useInstructionForm with correct fieldName", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="bodyInstructions" />
    )

    expect(useInstructionForm).toHaveBeenCalledWith({
      fieldName: "bodyInstructions",
    })
  })

  it("should render multiple instructions with correct step prop", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: "", min: 1, sec: 0 },
        { id: "2", text: "", min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions
        legend="Test legend"
        lessonKey="coolDownInstructions"
      />
    )

    expect(mockRegister).toHaveBeenCalledWith("coolDownInstructions.0.text")
    expect(mockRegister).toHaveBeenCalledWith("coolDownInstructions.1.text")
  })

  it("should not call addInstruction on initial render", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [{ id: "1", text: "", min: 1, sec: 0 }] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      saveAndNavigate: vi.fn(),
    })

    render(
      <CustomInstructions legend="Test legend" lessonKey="warmUpInstructions" />
    )

    expect(mockAddInstruction).not.toHaveBeenCalled()
  })
})

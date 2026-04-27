/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import CustomInstructions from "./CustomInstructions"
import { renderWithProvider } from "@/__tests__/helpers/renderWithProvider"
import { useInstructionForm } from "@/hooks/useInstructionForm"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Lesson } from "@/types"
import { createTiptapJSON } from "@/utils/tiptapHelpers"

vi.mock("@/hooks/useInstructionForm")

vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form")
  return {
    ...actual,
    Controller: ({ render }: any) => {
      const field = {
        value: { type: "doc", content: [] },
        onChange: vi.fn(),
        onBlur: vi.fn(),
        name: "test",
        ref: vi.fn(),
      }
      return render({ field })
    },
  }
})

vi.mock("@/components/lessonForm/FormSaveAndNavigate", () => ({
  default: ({ handleSubmit, prev, next }: any) => (
    <div data-testid="form-save-navigate">
      <button
        data-testid="prev-button"
        data-route={prev}
      >
        Prev
      </button>
      <button
        data-testid="next-button"
        data-route={next}
      >
        Next
      </button>
    </div>
  ),
}))

describe("CustomInstructions", () => {
  const mockRegister: UseFormRegister<Lesson> = vi.fn((name) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }))

  const mockAddInstruction = vi.fn()
  const mockRemoveLastInstruction = vi.fn()
  const mockControl = {
    register: mockRegister,
    unregister: vi.fn(),
    getFieldState: vi.fn(),
    _subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    _subjects: {
      values: {
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
        unsubscribe: vi.fn(),
      },
      array: {
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
        unsubscribe: vi.fn(),
      },
      state: {
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
        unsubscribe: vi.fn(),
      },
    },
    _options: {
      shouldUnregister: false,
    },
    _executeSchema: vi.fn(),
    _getWatch: vi.fn(),
    _getDirty: vi.fn(),
    _updateValid: vi.fn(),
    _removeUnmounted: vi.fn(),
    _formState: {
      isDirty: false,
      isSubmitting: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      isValid: false,
      isValidating: false,
      errors: {},
    },
    _reset: vi.fn(),
    _names: {
      mount: new Set(),
      unMount: new Set(),
      array: new Set(),
      watch: new Set(),
    },
    _state: {
      mount: false,
      action: false,
      watch: false,
    },
    _fields: {},
    _formValues: {},
    _proxyFormState: {},
    _defaultValues: {},
  } as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render one instruction", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
    )

    expect(screen.getByText("Instruction n°1")).toBeInTheDocument()
    expect(screen.queryByText("Instruction n°2")).not.toBeInTheDocument()
  })

  it("should render four instructions", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
        { id: "2", text: createTiptapJSON(""), min: 1, sec: 0 },
        { id: "3", text: createTiptapJSON(""), min: 1, sec: 0 },
        { id: "4", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
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
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
    )

    const addButton = screen.getByRole("button", { name: /ajouter un champs/i })
    await user.click(addButton)

    expect(mockAddInstruction).toHaveBeenCalledTimes(1)
  })

  it("should contain a field legend", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
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
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
    )

    expect(screen.getByText("Text is required")).toBeInTheDocument()
  })

  it("index should be passed to Instruction", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
        { id: "2", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
    )

    expect(screen.getByText("Instruction n°1")).toBeInTheDocument()
    expect(screen.getByText("Instruction n°2")).toBeInTheDocument()
  })

  it("register should be passed to Instruction", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
      removeLastInstruction: mockRemoveLastInstruction,
      control: mockControl,
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
    )

    expect(mockRegister).toHaveBeenCalledWith("warmUpInstructions.0.min")
    expect(mockRegister).toHaveBeenCalledWith("warmUpInstructions.0.sec")
    expect(mockRegister).not.toHaveBeenCalledWith("warmUpInstructions.0.text")
  })

  it("fieldLegend should display the legend prop", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Custom legend text"
        presetType="warmUpInstructions"
      />,
    )

    expect(screen.getByText("Custom legend text")).toBeInTheDocument()
  })

  it("should render the add button with correct text", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
    )

    const addButton = screen.getByRole("button", { name: /ajouter un champs/i })
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveAttribute("type", "button")
  })

  it("should call useInstructionForm with correct fieldName", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="bodyInstructions"
      />,
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
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
        { id: "2", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
      removeLastInstruction: mockRemoveLastInstruction,
      control: mockControl,
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="coolDownInstructions"
      />,
    )

    expect(mockRegister).toHaveBeenCalledWith("coolDownInstructions.0.min")
    expect(mockRegister).toHaveBeenCalledWith("coolDownInstructions.1.min")
    expect(mockRegister).not.toHaveBeenCalledWith("coolDownInstructions.0.text")
    expect(mockRegister).not.toHaveBeenCalledWith("coolDownInstructions.1.text")
  })

  it("should not call addInstruction on initial render", () => {
    vi.mocked(useInstructionForm).mockReturnValue({
      register: mockRegister,
      errors: {} as FieldErrors<Lesson>,
      fields: [
        { id: "1", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as unknown as any,
      addInstruction: mockAddInstruction,
      handleSubmit: vi.fn(),
      getValues: vi.fn(),
    })

    renderWithProvider(
      <CustomInstructions
        legend="Test legend"
        presetType="warmUpInstructions"
      />,
    )

    expect(mockAddInstruction).not.toHaveBeenCalled()
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useInstructionFieldArray } from "./useInstructionFieldArray"
import { Lesson } from "@/types"
import { Control } from "react-hook-form"
import { createTiptapJSON } from "@/utils/tiptapHelpers"
import { defaultValues } from "@/data/instructionDefaultValues"

vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form")
  return {
    ...actual,
    useFieldArray: vi.fn(),
  }
})

vi.mock("@/data/instructionDefaultValues", () => ({
  defaultValues: [{ text: { type: "doc", content: [] }, min: 1, sec: 0 }],
}))

const { useFieldArray } = await import("react-hook-form")

describe("useInstructionFieldArray", () => {
  const mockAppend = vi.fn()
  const mockRemove = vi.fn()
  const mockControl = {} as Control<Lesson>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should initialize with lesson field length", () => {
    const lesson: Lesson = {
      warmUpInstructions: [
        { text: createTiptapJSON("Instruction 1"), min: 1, sec: 0 },
        { text: createTiptapJSON("Instruction 2"), min: 2, sec: 0 },
      ],
    }

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", text: createTiptapJSON("Instruction 1"), min: 1, sec: 0 },
        { id: "2", text: createTiptapJSON("Instruction 2"), min: 2, sec: 0 },
      ] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    const { result } = renderHook(() =>
      useInstructionFieldArray(lesson, "warmUpInstructions", mockControl)
    )

    expect(result.current.fields).toHaveLength(2)
  })

  it("should initialize with 1 instruction when lesson field is empty", () => {
    const lesson: Lesson = {}

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    renderHook(() =>
      useInstructionFieldArray(lesson, "warmUpInstructions", mockControl)
    )

    expect(useFieldArray).toHaveBeenCalledWith({
      name: "warmUpInstructions",
      control: mockControl,
    })
  })

  it("should call append when addInstruction is called", () => {
    const lesson: Lesson = {
      warmUpInstructions: [
        { text: createTiptapJSON("Instruction 1"), min: 1, sec: 0 },
      ],
    }

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", text: createTiptapJSON("Instruction 1"), min: 1, sec: 0 },
      ] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    const { result, rerender } = renderHook(() =>
      useInstructionFieldArray(lesson, "warmUpInstructions", mockControl)
    )

    act(() => {
      result.current.addInstruction()
    })

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", text: createTiptapJSON("Instruction 1"), min: 1, sec: 0 },
        { id: "2", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    rerender()

    expect(mockAppend).toHaveBeenCalledWith(defaultValues)
  })

  it("should append new instruction with default values", () => {
    const lesson: Lesson = {
      bodyInstructions: [
        { text: createTiptapJSON("Existing"), min: 2, sec: 30 },
      ],
    }

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", text: createTiptapJSON("Existing"), min: 2, sec: 30 },
      ] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    const { result, rerender } = renderHook(() =>
      useInstructionFieldArray(lesson, "bodyInstructions", mockControl)
    )

    act(() => {
      result.current.addInstruction()
    })

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", text: createTiptapJSON("Existing"), min: 2, sec: 30 },
        { id: "2", text: createTiptapJSON(""), min: 1, sec: 0 },
      ] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    rerender()

    expect(mockAppend).toHaveBeenCalledWith(defaultValues)
  })

  it("should work with different field names", () => {
    const lesson: Lesson = {
      coolDownInstructions: [
        { text: createTiptapJSON("Cool down"), min: 3, sec: 0 },
      ],
    }

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", text: createTiptapJSON("Cool down"), min: 3, sec: 0 },
      ] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    renderHook(() =>
      useInstructionFieldArray(lesson, "coolDownInstructions", mockControl)
    )

    expect(useFieldArray).toHaveBeenCalledWith({
      name: "coolDownInstructions",
      control: mockControl,
    })
  })

  it("should return addInstruction function", () => {
    const lesson: Lesson = {}

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [],
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    const { result } = renderHook(() =>
      useInstructionFieldArray(lesson, "warmUpInstructions", mockControl)
    )

    expect(result.current.addInstruction).toBeInstanceOf(Function)
  })

  it("should return fields array", () => {
    const lesson: Lesson = {
      warmUpInstructions: [{ text: createTiptapJSON("Test"), min: 1, sec: 0 }],
    }

    const mockFields = [
      { id: "1", text: createTiptapJSON("Test"), min: 1, sec: 0 },
    ]

    vi.mocked(useFieldArray).mockReturnValue({
      fields: mockFields as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    const { result } = renderHook(() =>
      useInstructionFieldArray(lesson, "warmUpInstructions", mockControl)
    )

    expect(result.current.fields).toEqual(mockFields)
  })

  it("should handle multiple addInstruction calls", () => {
    const lesson: Lesson = {
      warmUpInstructions: [{ text: createTiptapJSON("First"), min: 1, sec: 0 }],
    }

    let currentFields = [
      { id: "1", text: createTiptapJSON("First"), min: 1, sec: 0 },
    ]

    vi.mocked(useFieldArray).mockImplementation(() => ({
      fields: currentFields as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    }))

    const { result, rerender } = renderHook(() =>
      useInstructionFieldArray(lesson, "warmUpInstructions", mockControl)
    )

    act(() => {
      result.current.addInstruction()
    })

    currentFields = [
      ...currentFields,
      { id: "2", text: createTiptapJSON(""), min: 1, sec: 0 },
    ]
    rerender()

    act(() => {
      result.current.addInstruction()
    })

    currentFields = [
      ...currentFields,
      { id: "3", text: createTiptapJSON(""), min: 1, sec: 0 },
    ]
    rerender()

    expect(mockAppend).toHaveBeenCalledTimes(2)
  })

  it("should initialize instructionCount based on lesson field length", () => {
    const lesson: Lesson = {
      warmUpInstructions: [
        { text: createTiptapJSON("1"), min: 1, sec: 0 },
        { text: createTiptapJSON("2"), min: 1, sec: 0 },
        { text: createTiptapJSON("3"), min: 1, sec: 0 },
      ],
    }

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", text: createTiptapJSON("1"), min: 1, sec: 0 },
        { id: "2", text: createTiptapJSON("2"), min: 1, sec: 0 },
        { id: "3", text: createTiptapJSON("3"), min: 1, sec: 0 },
      ] as any,
      append: mockAppend,
      remove: mockRemove,
      prepend: vi.fn(),
      insert: vi.fn(),
      swap: vi.fn(),
      move: vi.fn(),
      update: vi.fn(),
      replace: vi.fn(),
    })

    const { result } = renderHook(() =>
      useInstructionFieldArray(lesson, "warmUpInstructions", mockControl)
    )

    expect(result.current.fields).toHaveLength(3)
  })
})

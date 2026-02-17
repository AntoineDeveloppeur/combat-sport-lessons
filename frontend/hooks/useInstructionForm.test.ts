/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { createWrapper } from "@/__tests__/helpers/renderWithProvider"
import { useInstructionForm } from "./useInstructionForm"
import { Lesson } from "@/types"
import { ReactNode } from "react"

vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form")
  return {
    ...actual,
    useForm: vi.fn(),
  }
})

vi.mock("./useInstructionFieldArray", () => ({
  useInstructionFieldArray: vi.fn(),
}))

vi.mock("./useSaveAndNavigate", () => ({
  useSaveAndNavigate: vi.fn(),
}))

vi.mock("@/utils/getInstructionYupValidationSchema", () => ({
  getYupValidationSchema: vi.fn(),
}))

vi.mock("@/app/provider", () => ({
  LessonContext: {
    Provider: ({ children }: { children: ReactNode }) => children,
    Consumer: vi.fn(),
  },
}))

vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    useContext: vi.fn(),
  }
})

const { useForm } = await import("react-hook-form")
const { useInstructionFieldArray } = await import("./useInstructionFieldArray")
const { useSaveAndNavigate } = await import("./useSaveAndNavigate")
const { getYupValidationSchema } =
  await import("@/utils/getInstructionYupValidationSchema")
const { useContext } = await import("react")

describe("useInstructionForm", () => {
  const mockHandleSubmit = vi.fn()
  const mockRegister = vi.fn()
  const mockControl = {}
  const mockAddInstruction = vi.fn()
  const mockSaveAndNavigate = vi.fn()
  const mockSetLesson = vi.fn()

  const mockLesson: Lesson = {
    warmUp: "custom",
    coolDown: "custom",
    warmUpInstructions: [{ text: "", min: 1, sec: 0 }],
    bodyInstructions: [{ text: "", min: 1, sec: 0 }],
    coolDownInstructions: [{ text: "", min: 1, sec: 0 }],
  }

  const mockFields = [{ id: "1", text: "Warm up", min: 1, sec: 0 }]

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useContext).mockReturnValue([mockLesson, mockSetLesson])

    vi.mocked(getYupValidationSchema).mockReturnValue({} as any)

    vi.mocked(useForm).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      formState: { errors: {} },
      control: mockControl,
      watch: vi.fn(),
      getValues: vi.fn(),
      getFieldState: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      setValue: vi.fn(),
      trigger: vi.fn(),
      resetField: vi.fn(),
      reset: vi.fn(),
      setFocus: vi.fn(),
      unregister: vi.fn(),
    } as any)

    vi.mocked(useInstructionFieldArray).mockReturnValue({
      addInstruction: mockAddInstruction,

      fields: mockFields as any,
    })

    vi.mocked(useSaveAndNavigate).mockReturnValue({
      saveAndNavigate: mockSaveAndNavigate,
    })
  })

  it("should return handleSubmit from useForm", () => {
    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current.handleSubmit).toBe(mockHandleSubmit)
  })

  it("should return register from useForm", () => {
    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current.register).toBe(mockRegister)
  })

  it("should return errors from useForm", () => {
    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current.errors).toEqual({})
  })

  it("should return fields from useInstructionFieldArray", () => {
    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current.fields).toBe(mockFields)
  })

  it("should return addInstruction from useInstructionFieldArray", () => {
    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current.addInstruction).toBe(mockAddInstruction)
  })

  it("should return saveAndNavigate from useSaveAndNavigate", () => {
    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current.saveAndNavigate).toBe(mockSaveAndNavigate)
  })

  it("should call getYupValidationSchema with fieldName", () => {
    renderHook(() => useInstructionForm({ fieldName: "bodyInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(getYupValidationSchema).toHaveBeenCalledWith("bodyInstructions")
  })

  it("should call useForm with defaultValues and resolver", () => {
    const mockSchema = { test: "schema" }

    vi.mocked(getYupValidationSchema).mockReturnValue(mockSchema as any)

    renderHook(() => useInstructionForm({ fieldName: "warmUpInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(useForm).toHaveBeenCalledWith({
      defaultValues: mockLesson,
      resolver: expect.any(Function),
    })
  })

  it("should call useInstructionFieldArray with lesson, fieldName and control", () => {
    renderHook(() => useInstructionForm({ fieldName: "warmUpInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(useInstructionFieldArray).toHaveBeenCalledWith(
      mockLesson,
      "warmUpInstructions",
      mockControl
    )
  })

  it("should call useSaveAndNavigate with handleSubmit", () => {
    renderHook(() => useInstructionForm({ fieldName: "warmUpInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(useSaveAndNavigate).toHaveBeenCalledWith(mockHandleSubmit)
  })

  it("should work with warmUpInstructions fieldName", () => {
    renderHook(() => useInstructionForm({ fieldName: "warmUpInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(getYupValidationSchema).toHaveBeenCalledWith("warmUpInstructions")
  })

  it("should work with bodyInstructions fieldName", () => {
    renderHook(() => useInstructionForm({ fieldName: "bodyInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(getYupValidationSchema).toHaveBeenCalledWith("bodyInstructions")
  })

  it("should work with coolDownInstructions fieldName", () => {
    renderHook(
      () => useInstructionForm({ fieldName: "coolDownInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(getYupValidationSchema).toHaveBeenCalledWith("coolDownInstructions")
  })

  it("should use Redux to get lesson", () => {
    renderHook(() => useInstructionForm({ fieldName: "warmUpInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(getYupValidationSchema).toHaveBeenCalled()
  })

  it("should return all required properties", () => {
    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current).toHaveProperty("handleSubmit")
    expect(result.current).toHaveProperty("register")
    expect(result.current).toHaveProperty("errors")
    expect(result.current).toHaveProperty("fields")
    expect(result.current).toHaveProperty("addInstruction")
    expect(result.current).toHaveProperty("saveAndNavigate")
  })

  it("should handle errors from useForm", () => {
    const mockErrors = {
      warmUpInstructions: [
        {
          text: { message: "Text is required", type: "required" },
        },
      ],
    }

    vi.mocked(useForm).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      formState: { errors: mockErrors },
      control: mockControl,
      watch: vi.fn(),
      getValues: vi.fn(),
      getFieldState: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      setValue: vi.fn(),
      trigger: vi.fn(),
      resetField: vi.fn(),
      reset: vi.fn(),
      setFocus: vi.fn(),
      unregister: vi.fn(),
    } as any)

    const { result } = renderHook(
      () => useInstructionForm({ fieldName: "warmUpInstructions" }),
      { wrapper: createWrapper() }
    )

    expect(result.current.errors).toEqual(mockErrors)
  })

  it("should pass control to useInstructionFieldArray", () => {
    const customControl = { test: "control" }

    vi.mocked(useForm).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      register: mockRegister,
      formState: { errors: {} },
      control: customControl,
      watch: vi.fn(),
      getValues: vi.fn(),
      getFieldState: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      setValue: vi.fn(),
      trigger: vi.fn(),
      resetField: vi.fn(),
      reset: vi.fn(),
      setFocus: vi.fn(),
      unregister: vi.fn(),
    } as any)

    renderHook(() => useInstructionForm({ fieldName: "warmUpInstructions" }), {
      wrapper: createWrapper(),
    })

    expect(useInstructionFieldArray).toHaveBeenCalledWith(
      mockLesson,
      "warmUpInstructions",
      customControl
    )
  })
})

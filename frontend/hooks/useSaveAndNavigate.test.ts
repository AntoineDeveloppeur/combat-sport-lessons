import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSaveAndNavigate } from "./useSaveAndNavigate"
import { Lesson } from "@/types"
import { UseFormHandleSubmit } from "react-hook-form"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

const { useRouter } = await import("next/navigation")

describe("useSaveAndNavigate", () => {
  const mockPush = vi.fn()
  const mockSetLesson = vi.fn()
  const mockHandleSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    })
  })

  it("should return saveAndNavigate function", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    expect(result.current.saveAndNavigate).toBeInstanceOf(Function)
  })

  it("should call handleSubmit when saveAndNavigate is called", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it("should call setLesson with merged data", () => {
    const formData: Partial<Lesson> = {
      sport: "Boxing",
      objective: "Improve stamina",
    }

    mockHandleSubmit.mockImplementation((callback) => () => {
      callback(formData)
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockSetLesson).toHaveBeenCalled()
    const setLessonCallback = mockSetLesson.mock.calls[0][0]
    const previousLesson: Lesson = { warmUp: "custom" }
    const result_data = setLessonCallback(previousLesson)

    expect(result_data).toEqual({
      warmUp: "custom",
      sport: "Boxing",
      objective: "Improve stamina",
    })
  })

  it("should navigate to route when route is provided", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate("/form/echauffement")
    })

    expect(mockPush).toHaveBeenCalledWith("/form/echauffement")
  })

  it("should not navigate when route is not provided", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("should merge previous lesson data with new form data", () => {
    const newData: Partial<Lesson> = {
      bodyInstructions: [{ text: "Push-ups", min: 2, sec: 0 }],
    }

    mockHandleSubmit.mockImplementation((callback) => () => {
      callback(newData)
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    const setLessonCallback = mockSetLesson.mock.calls[0][0]
    const previousLesson: Lesson = {
      sport: "Karate",
      warmUpInstructions: [{ text: "Warm up", min: 1, sec: 0 }],
    }
    const mergedData = setLessonCallback(previousLesson)

    expect(mergedData).toEqual({
      sport: "Karate",
      warmUpInstructions: [{ text: "Warm up", min: 1, sec: 0 }],
      bodyInstructions: [{ text: "Push-ups", min: 2, sec: 0 }],
    })
  })

  it("should navigate to different routes", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate("/form/corps")
    })

    expect(mockPush).toHaveBeenCalledWith("/form/corps")

    act(() => {
      result.current.saveAndNavigate("/form/calme")
    })

    expect(mockPush).toHaveBeenCalledWith("/form/calme")
  })

  it("should handle empty form data", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockSetLesson).toHaveBeenCalled()
    const setLessonCallback = mockSetLesson.mock.calls[0][0]
    const previousLesson: Lesson = { sport: "Judo" }
    const result_data = setLessonCallback(previousLesson)

    expect(result_data).toEqual({ sport: "Judo" })
  })

  it("should override previous lesson properties with new data", () => {
    const newData: Partial<Lesson> = {
      sport: "Boxing",
      objective: "New objective",
    }

    mockHandleSubmit.mockImplementation((callback) => () => {
      callback(newData)
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    const setLessonCallback = mockSetLesson.mock.calls[0][0]
    const previousLesson: Lesson = {
      sport: "Karate",
      objective: "Old objective",
    }
    const mergedData = setLessonCallback(previousLesson)

    expect(mergedData).toEqual({
      sport: "Boxing",
      objective: "New objective",
    })
  })

  it("should call handleSubmit callback immediately", () => {
    const callbackSpy = vi.fn()
    mockHandleSubmit.mockImplementation((callback) => {
      callbackSpy()
      return () => {
        callback({})
      }
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(callbackSpy).toHaveBeenCalled()
  })

  it("should work with route as undefined explicitly", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(() =>
      useSaveAndNavigate(
        mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>,
        mockSetLesson
      )
    )

    act(() => {
      result.current.saveAndNavigate(undefined)
    })

    expect(mockPush).not.toHaveBeenCalled()
    expect(mockSetLesson).toHaveBeenCalled()
  })
})

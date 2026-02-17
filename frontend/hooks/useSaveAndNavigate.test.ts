import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSaveAndNavigate } from "./useSaveAndNavigate"
import { Lesson } from "@/types"
import { UseFormHandleSubmit } from "react-hook-form"
import { createWrapper } from "@/__tests__/helpers/renderWithProvider"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

vi.mock("@/store/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/store/hooks")>()
  return {
    ...actual,
    useAppDispatch: vi.fn(),
  }
})

const { useRouter } = await import("next/navigation")
const { useAppDispatch } = await import("@/store/hooks")

describe("useSaveAndNavigate", () => {
  const mockPush = vi.fn()
  const mockDispatch = vi.fn()
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
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch)
  })

  it("should return saveAndNavigate function", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    expect(result.current.saveAndNavigate).toBeInstanceOf(Function)
  })

  it("should call handleSubmit when saveAndNavigate is called", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it("should call dispatch with form data", () => {
    const formData: Partial<Lesson> = {
      sport: "Boxing",
      objective: "Improve stamina",
    }

    mockHandleSubmit.mockImplementation((callback) => () => {
      callback(formData)
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
        payload: formData,
      })
    )
  })

  it("should navigate to route when route is provided", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
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

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it("should dispatch new form data", () => {
    const newData: Partial<Lesson> = {
      bodyInstructions: [{ text: "Push-ups", min: 2, sec: 0 }],
    }

    mockHandleSubmit.mockImplementation((callback) => () => {
      callback(newData)
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
        payload: newData,
      })
    )
  })

  it("should navigate to different routes", () => {
    mockHandleSubmit.mockImplementation((callback) => () => {
      callback({})
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
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

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
        payload: {},
      })
    )
  })

  it("should dispatch new data to Redux", () => {
    const newData: Partial<Lesson> = {
      sport: "Boxing",
      objective: "New objective",
    }

    mockHandleSubmit.mockImplementation((callback) => () => {
      callback(newData)
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.saveAndNavigate()
    })

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
        payload: newData,
      })
    )
  })

  it("should call handleSubmit callback immediately", () => {
    const callbackSpy = vi.fn()
    mockHandleSubmit.mockImplementation((callback) => {
      callbackSpy()
      return () => {
        callback({})
      }
    })

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
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

    const { result } = renderHook(
      () =>
        useSaveAndNavigate(
          mockHandleSubmit as unknown as UseFormHandleSubmit<Lesson>
        ),
      { wrapper: createWrapper() }
    )

    act(() => {
      result.current.saveAndNavigate(undefined)
    })

    expect(mockPush).not.toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalled()
  })
})

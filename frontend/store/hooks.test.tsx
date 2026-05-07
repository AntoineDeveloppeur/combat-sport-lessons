import { ReactNode } from "react"
import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { useAppDispatch, useAppSelector } from "./hooks"
import { lessonFormSlice } from "@/features/lessonForm/lessonFormSlice"

describe("Store hooks", () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        lessonForm: lessonFormSlice.reducer,
      },
    })
  }

  const createWrapper = (store: ReturnType<typeof createTestStore>) => {
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    Wrapper.displayName = "TestWrapper"
    return Wrapper
  }

  describe("useAppDispatch", () => {
    it("should return dispatch function", () => {
      const store = createTestStore()
      const wrapper = createWrapper(store)

      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      expect(result.current).toBeDefined()
      expect(typeof result.current).toBe("function")
    })

    it("should dispatch actions correctly", () => {
      const store = createTestStore()
      const wrapper = createWrapper(store)

      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      const action = lessonFormSlice.actions.save({
        sport: "Karate",
        objective: "Test objective",
      })

      result.current(action)

      const state = store.getState()
      expect(state.lessonForm.value.sport).toBe("Karate")
      expect(state.lessonForm.value.objective).toBe("Test objective")
    })

    it("should be stable across re-renders", () => {
      const store = createTestStore()
      const wrapper = createWrapper(store)

      const { result, rerender } = renderHook(() => useAppDispatch(), {
        wrapper,
      })

      const firstDispatch = result.current
      rerender()
      const secondDispatch = result.current

      expect(firstDispatch).toBe(secondDispatch)
    })
  })

  describe("useAppSelector", () => {
    it("should select state correctly", () => {
      const store = createTestStore()
      const wrapper = createWrapper(store)

      const { result } = renderHook(
        () => useAppSelector((state) => state.lessonForm.value),
        { wrapper }
      )

      expect(result.current).toBeDefined()
      expect(result.current).toHaveProperty("warmUp")
      expect(result.current).toHaveProperty("coolDown")
    })

    it("should update when state changes", () => {
      const store = createTestStore()
      const wrapper = createWrapper(store)

      const { result } = renderHook(
        () => useAppSelector((state) => state.lessonForm.value.sport),
        { wrapper }
      )

      expect(result.current).toBeUndefined()

      store.dispatch(
        lessonFormSlice.actions.save({
          sport: "Boxing",
        })
      )

      expect(store.getState().lessonForm.value.sport).toBe("Boxing")
    })

    it("should select nested state correctly", () => {
      const store = createTestStore()
      store.dispatch(
        lessonFormSlice.actions.save({
          sport: "Judo",
          title: "Test Title",
          objective: "Test Objective",
        })
      )

      const wrapper = createWrapper(store)

      const { result } = renderHook(
        () => useAppSelector((state) => state.lessonForm.value),
        { wrapper }
      )

      expect(result.current.sport).toBe("Judo")
      expect(result.current.title).toBe("Test Title")
      expect(result.current.objective).toBe("Test Objective")
    })

    it("should work with multiple selectors", () => {
      const store = createTestStore()
      store.dispatch(
        lessonFormSlice.actions.save({
          sport: "Karate",
          warmUp: "preset",
        })
      )

      const wrapper = createWrapper(store)

      const { result: sportResult } = renderHook(
        () => useAppSelector((state) => state.lessonForm.value.sport),
        { wrapper }
      )

      const { result: warmUpResult } = renderHook(
        () => useAppSelector((state) => state.lessonForm.value.warmUp),
        { wrapper }
      )

      expect(sportResult.current).toBe("Karate")
      expect(warmUpResult.current).toBe("preset")
    })

    it("should handle complex selector logic", () => {
      const store = createTestStore()
      store.dispatch(
        lessonFormSlice.actions.save({
          warmUpInstructions: [
            { text: "Instruction 1", minutes: 5, seconds: 0 },
            { text: "Instruction 2", minutes: 3, seconds: 30 },
          ],
        })
      )

      const wrapper = createWrapper(store)

      const { result } = renderHook(
        () =>
          useAppSelector(
            (state) => state.lessonForm.value.warmUpInstructions?.length || 0
          ),
        { wrapper }
      )

      expect(result.current).toBe(2)
    })
  })

  describe("Type safety", () => {
    it("should provide correct TypeScript types for dispatch", () => {
      const store = createTestStore()
      const wrapper = createWrapper(store)

      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      // This should compile without errors
      const action = lessonFormSlice.actions.save({ sport: "Judo" })
      result.current(action)

      expect(store.getState().lessonForm.value.sport).toBe("Judo")
    })

    it("should provide correct TypeScript types for selector", () => {
      const store = createTestStore()
      const wrapper = createWrapper(store)

      const { result } = renderHook(
        () => useAppSelector((state) => state.lessonForm),
        { wrapper }
      )

      // This should compile without errors
      expect(result.current).toHaveProperty("value")
      expect(result.current.value).toBeDefined()
    })
  })
})

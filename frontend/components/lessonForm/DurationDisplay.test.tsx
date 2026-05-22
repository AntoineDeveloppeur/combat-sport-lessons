import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import DurationDisplay from "./DurationDisplay"
import { lessonFormSlice } from "@/features/lessonForm/lessonFormSlice"
import type { Lesson } from "@/types"

const createMockStore = (lesson: Partial<Lesson>) => {
  return configureStore({
    reducer: {
      lessonForm: lessonFormSlice.reducer,
    },
    preloadedState: {
      lessonForm: {
        value: lesson,
      },
    },
  })
}

describe("DurationDisplay", () => {
  describe("Rendering", () => {
    it("should render the duration label", () => {
      const mockLesson = {
        warmUpInstructions: [],
        bodyInstructions: [],
        coolDownInstructions: [],
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      expect(screen.getByText("Durée totale de la leçon")).toBeInTheDocument()
    })

    it("should display 'pas de durée' when no instructions", () => {
      const mockLesson = {
        warmUpInstructions: [],
        bodyInstructions: [],
        coolDownInstructions: [],
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      expect(screen.getByText("pas de durée")).toBeInTheDocument()
    })

    it("should display minutes only when duration is less than 60 minutes", () => {
      const mockLesson = {
        warmUpInstructions: [{ min: 10, sec: 0 }],
        bodyInstructions: [{ min: 20, sec: 30 }],
        coolDownInstructions: [{ min: 5, sec: 0 }],
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      expect(screen.getByText("36 min")).toBeInTheDocument()
    })

    it("should display hours and minutes when duration is 60 minutes or more", () => {
      const mockLesson = {
        warmUpInstructions: [{ min: 30, sec: 0 }],
        bodyInstructions: [{ min: 45, sec: 30 }],
        coolDownInstructions: [{ min: 10, sec: 0 }],
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      expect(screen.getByText("1h26")).toBeInTheDocument()
    })

    it("should display hours only when minutes are exactly 0", () => {
      const mockLesson = {
        warmUpInstructions: [{ min: 30, sec: 0 }],
        bodyInstructions: [{ min: 30, sec: 0 }],
        coolDownInstructions: [],
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      expect(screen.getByText("1h")).toBeInTheDocument()
    })
  })

  describe("Calculation", () => {
    it("should round up seconds to the next minute", () => {
      const mockLesson = {
        warmUpInstructions: [{ min: 5, sec: 30 }],
        bodyInstructions: [{ min: 10, sec: 15 }],
        coolDownInstructions: [{ min: 3, sec: 45 }],
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      // Total: 5*60+30 + 10*60+15 + 3*60+45 = 330 + 615 + 225 = 1170 seconds = 19.5 minutes -> rounds up to 20min
      expect(screen.getByText("20 min")).toBeInTheDocument()
    })

    it("should handle all instruction types (warmUp, body, coolDown)", () => {
      const mockLesson = {
        warmUpInstructions: [
          { min: 2, sec: 0 },
          { min: 3, sec: 0 },
        ],
        bodyInstructions: [
          { min: 10, sec: 0 },
          { min: 15, sec: 0 },
        ],
        coolDownInstructions: [
          { min: 5, sec: 0 },
          { min: 5, sec: 0 },
        ],
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      // Total: 2+3+10+15+5+5 = 40min
      expect(screen.getByText("40 min")).toBeInTheDocument()
    })

    it("should handle missing instruction arrays", () => {
      const mockLesson = {
        warmUpInstructions: undefined,
        bodyInstructions: [{ min: 10, sec: 0 }],
        coolDownInstructions: null,
      }
      const store = createMockStore(mockLesson)

      render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      expect(screen.getByText("10 min")).toBeInTheDocument()
    })
  })

  describe("Styling", () => {
    it("should render with correct container classes", () => {
      const mockLesson = {
        warmUpInstructions: [],
        bodyInstructions: [],
        coolDownInstructions: [],
      }
      const store = createMockStore(mockLesson)

      const { container } = render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      const divElement = container.querySelector(".w-full.py-4.px-6.rounded-lg")
      expect(divElement).toBeInTheDocument()
    })

    it("should render with flex layout and gap", () => {
      const mockLesson = {
        warmUpInstructions: [],
        bodyInstructions: [],
        coolDownInstructions: [],
      }
      const store = createMockStore(mockLesson)

      const { container } = render(
        <Provider store={store}>
          <DurationDisplay />
        </Provider>
      )

      const flexContainer = container.querySelector(
        ".flex.items-center.justify-end.gap-3"
      )
      expect(flexContainer).toBeInTheDocument()
    })
  })
})

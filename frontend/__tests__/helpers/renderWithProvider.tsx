import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { lessonSlice } from "@/features/lesson/lessonSlice"
import { Lesson } from "@/types"
import { defaultValues } from "@/data/instructionDefaultValues"

export const renderWithProvider = (
  component: React.ReactElement,
  lesson?: Lesson
) => {
  // Créer un état initial pour le store de test
  const preloadedState = {
    lesson: {
      value: lesson || {
        warmUp: "custom",
        coolDown: "custom",
        warmUpInstructions: defaultValues,
        bodyInstructions: defaultValues,
        coolDownInstructions: defaultValues,
      },
    },
  }

  // Créer un store de test avec l'état initial personnalisé
  const mockStore = configureStore({
    reducer: {
      lesson: lessonSlice.reducer,
    },
    preloadedState,
  })

  return render(<Provider store={mockStore}>{component}</Provider>)
}

export const createWrapper = (lesson?: Lesson) => {
  const preloadedState = {
    lesson: {
      value: lesson || {
        warmUp: "custom",
        coolDown: "custom",
        warmUpInstructions: defaultValues,
        bodyInstructions: defaultValues,
        coolDownInstructions: defaultValues,
      },
    },
  }

  const mockStore = configureStore({
    reducer: {
      lesson: lessonSlice.reducer,
    },
    preloadedState,
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={mockStore}>{children}</Provider>
  )
  Wrapper.displayName = "ReduxWrapper"

  return Wrapper
}

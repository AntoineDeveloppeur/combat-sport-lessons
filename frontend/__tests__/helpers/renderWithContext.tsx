import { LessonContext } from "@/app/provider"
import { render } from "@testing-library/react"

export const renderWithContext = (component: React.ReactElement) => {
  const mockLesson = {
    warmUpInstructions: [{ text: "", min: 1, sec: 0 }],
  }
  const mockSetLesson = vi.fn()

  return render(
    <LessonContext.Provider value={[mockLesson, mockSetLesson]}>
      {component}
    </LessonContext.Provider>
  )
}

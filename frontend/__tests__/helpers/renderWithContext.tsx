import { render } from "@testing-library/react"
import { LessonContext } from "@/app/provider"
import { Lesson } from "@/types"

export const renderWithContext = (
  component: React.ReactElement,
  lesson?: Lesson
) => {
  const mockSetLesson = vi.fn()
  const mockLesson = lesson ? lesson : {}

  return render(
    <LessonContext.Provider value={[mockLesson, mockSetLesson]}>
      {component}
    </LessonContext.Provider>
  )
}

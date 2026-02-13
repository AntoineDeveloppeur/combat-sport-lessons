import { render } from "@testing-library/react"
import { LessonContext } from "@/app/provider"

export const renderWithContext = (component: React.ReactElement) => {
  const mockSetLesson = vi.fn()

  return render(
    <LessonContext.Provider value={[{}, mockSetLesson]}>
      {component}
    </LessonContext.Provider>
  )
}

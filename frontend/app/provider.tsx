"use client"

import { createContext, useState, Dispatch, SetStateAction } from "react"
import { Lesson } from "@/types"

type LessonContextType = [Lesson, Dispatch<SetStateAction<Lesson>>] | undefined

export const LessonContext = createContext<LessonContextType>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useState<Lesson>({})
  return (
    <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
  )
}

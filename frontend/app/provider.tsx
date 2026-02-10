"use client"

import { createContext, useState, Dispatch, SetStateAction } from "react"
import { FormState } from "@/types"

type LessonContextType =
  | [FormState, Dispatch<SetStateAction<FormState>>]
  | undefined

export const LessonContext = createContext<LessonContextType>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useState<FormState>({})
  return (
    <LessonContext.Provider value={value}>{children}</LessonContext.Provider>
  )
}

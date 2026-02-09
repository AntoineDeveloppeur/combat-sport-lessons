"use client"

import { createContext, useState, Dispatch, SetStateAction } from "react"
import { FormState } from "@/types"

type AppStateContextType =
  | [FormState, Dispatch<SetStateAction<FormState>>]
  | undefined

export const AppStateContext = createContext<AppStateContextType>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = useState<FormState>({})
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

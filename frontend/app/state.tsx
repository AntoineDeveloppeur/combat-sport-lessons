"use client"

import { createContext, useState, Dispatch, SetStateAction } from "react"

interface FormState {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  university?: string
  degree?: string
  about?: string
}

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

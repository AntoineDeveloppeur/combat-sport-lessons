"use client"

import { Provider } from "react-redux"
import { store } from "@/store/index"
import { AuthProvider } from "@/contexts/AuthContext"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  )
}

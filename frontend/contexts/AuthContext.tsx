"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { isTokenExpired } from "@/utils/isTokenExpired"

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
}

interface AuthContextType extends AuthState {
  saveAuth: (token: string, userId: string) => void
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const clearStoredAuth = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("userId")
}

const readStoredAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, userId: null }
  }

  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  if (!token || !userId) {
    return { isAuthenticated: false, userId: null }
  }

  if (isTokenExpired(token)) {
    clearStoredAuth()
    return { isAuthenticated: false, userId: null }
  }

  return { isAuthenticated: true, userId }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => readStoredAuth())

  const saveAuth = (token: string, userId: string) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
    setAuthState({
      isAuthenticated: true,
      userId,
    })
  }

  const logout = () => {
    clearStoredAuth()
    setAuthState({
      isAuthenticated: false,
      userId: null,
    })
  }

  const checkAuth = () => {
    const next = readStoredAuth()
    setAuthState((prev) =>
      prev.isAuthenticated === next.isAuthenticated &&
      prev.userId === next.userId
        ? prev
        : next
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        userId: authState.userId,
        saveAuth,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

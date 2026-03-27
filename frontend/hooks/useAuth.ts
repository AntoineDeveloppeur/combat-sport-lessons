"use client"

import { useState } from "react"

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
}

const getInitialAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, userId: null }
  }

  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  if (token && userId) {
    return { isAuthenticated: true, userId }
  }

  return { isAuthenticated: false, userId: null }
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState)

  const login = (token: string, userId: string) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
    setAuthState({
      isAuthenticated: true,
      userId,
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setAuthState({
      isAuthenticated: false,
      userId: null,
    })
  }

  return {
    isAuthenticated: authState.isAuthenticated,
    userId: authState.userId,
    login,
    logout,
  }
}

import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useAuth } from "./useAuth"

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("Initial state", () => {
    it("should initialize with unauthenticated state when no token in localStorage", () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.userId).toBe(null)
    })

    it("should initialize with authenticated state when token exists in localStorage", () => {
      localStorage.setItem("token", "fake-token")
      localStorage.setItem("userId", "user-123")

      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.userId).toBe("user-123")
    })

    it("should initialize as unauthenticated when only token exists", () => {
      localStorage.setItem("token", "fake-token")

      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.userId).toBe(null)
    })

    it("should initialize as unauthenticated when only userId exists", () => {
      localStorage.setItem("userId", "user-123")

      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.userId).toBe(null)
    })
  })

  describe("login", () => {
    it("should set authenticated state and store token in localStorage", () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.login("test-token", "user-456")
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.userId).toBe("user-456")
      expect(localStorage.getItem("token")).toBe("test-token")
      expect(localStorage.getItem("userId")).toBe("user-456")
    })

    it("should update state when logging in multiple times", () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.login("token-1", "user-1")
      })

      expect(result.current.userId).toBe("user-1")

      act(() => {
        result.current.login("token-2", "user-2")
      })

      expect(result.current.userId).toBe("user-2")
      expect(localStorage.getItem("token")).toBe("token-2")
      expect(localStorage.getItem("userId")).toBe("user-2")
    })

    it("should handle empty string token", () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.login("", "user-123")
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(localStorage.getItem("token")).toBe("")
    })

    it("should handle empty string userId", () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.login("token-123", "")
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.userId).toBe("")
    })
  })

  describe("logout", () => {
    it("should clear authenticated state and remove from localStorage", () => {
      localStorage.setItem("token", "test-token")
      localStorage.setItem("userId", "user-789")

      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.userId).toBe(null)
      expect(localStorage.getItem("token")).toBe(null)
      expect(localStorage.getItem("userId")).toBe(null)
    })

    it("should work when already logged out", () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.userId).toBe(null)
    })

    it("should clear state after login then logout", () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.login("token", "user-id")
      })

      expect(result.current.isAuthenticated).toBe(true)

      act(() => {
        result.current.logout()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.userId).toBe(null)
      expect(localStorage.getItem("token")).toBe(null)
      expect(localStorage.getItem("userId")).toBe(null)
    })
  })

  describe("State persistence", () => {
    it("should maintain state across re-renders", () => {
      const { result, rerender } = renderHook(() => useAuth())

      act(() => {
        result.current.login("token", "user-id")
      })

      rerender()

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.userId).toBe("user-id")
    })

    it("should load state from localStorage on mount", () => {
      localStorage.setItem("token", "existing-token")
      localStorage.setItem("userId", "existing-user")

      const { result } = renderHook(() => useAuth())

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.userId).toBe("existing-user")
    })
  })

  describe("Edge cases", () => {
    it("should handle special characters in token and userId", () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.login("token@#$%^&*()", "user!@#$%")
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.userId).toBe("user!@#$%")
      expect(localStorage.getItem("token")).toBe("token@#$%^&*()")
    })

    it("should handle very long token and userId", () => {
      const { result } = renderHook(() => useAuth())
      const longToken = "a".repeat(1000)
      const longUserId = "b".repeat(1000)

      act(() => {
        result.current.login(longToken, longUserId)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.userId).toBe(longUserId)
      expect(localStorage.getItem("token")).toBe(longToken)
    })
  })
})

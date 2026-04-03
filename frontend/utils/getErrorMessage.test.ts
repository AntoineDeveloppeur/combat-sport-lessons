import { describe, it, expect } from "vitest"
import { getErrorMessage } from "./getErrorMessage"
import type { BackendError } from "@/types"

describe("getErrorMessage", () => {
  it("should return the error message from backend error", () => {
    const error: BackendError = {
      data: {
        error: "Invalid credentials",
      },
    }

    const result = getErrorMessage(error)

    expect(result).toBe("Invalid credentials")
  })

  it("should return default message when error.data is undefined", () => {
    const error = {} as BackendError

    const result = getErrorMessage(error)

    expect(result).toBe("Une erreur est survenue")
  })

  it("should return default message when error.data.error is undefined", () => {
    const error: BackendError = {
      data: {} as { error: string },
    }

    const result = getErrorMessage(error)

    expect(result).toBe("Une erreur est survenue")
  })

  it("should return default message when error is null", () => {
    const error = null as unknown as BackendError

    const result = getErrorMessage(error)

    expect(result).toBe("Une erreur est survenue")
  })

  it("should return default message when error is undefined", () => {
    const error = undefined as unknown as BackendError

    const result = getErrorMessage(error)

    expect(result).toBe("Une erreur est survenue")
  })

  it("should handle empty string error message", () => {
    const error: BackendError = {
      data: {
        error: "",
      },
    }

    const result = getErrorMessage(error)

    expect(result).toBe("Une erreur est survenue")
  })

  it("should handle long error messages", () => {
    const longMessage = "A".repeat(500)
    const error: BackendError = {
      data: {
        error: longMessage,
      },
    }

    const result = getErrorMessage(error)

    expect(result).toBe(longMessage)
  })

  it("should handle error messages with special characters", () => {
    const error: BackendError = {
      data: {
        error: "Erreur: L'utilisateur n'existe pas! @#$%",
      },
    }

    const result = getErrorMessage(error)

    expect(result).toBe("Erreur: L'utilisateur n'existe pas! @#$%")
  })
})

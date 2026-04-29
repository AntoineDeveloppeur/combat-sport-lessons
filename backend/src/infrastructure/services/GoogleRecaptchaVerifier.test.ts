import { describe, test, expect, vi, beforeEach } from "vitest"
import { GoogleRecaptchaVerifier } from "./GoogleRecaptchaVerifier.js"
import { InvalidCaptchaError } from "../../domain/errors/InvalidCaptchaError.js"

global.fetch = vi.fn()

describe("GoogleRecaptchaVerifier", () => {
  const secretKey = "test_secret_key"
  let verifier: GoogleRecaptchaVerifier

  beforeEach(() => {
    verifier = new GoogleRecaptchaVerifier(secretKey)
    vi.clearAllMocks()
  })

  test("should verify successfully with valid token and good score", async () => {
    const mockResponse = {
      success: true,
      score: 0.9,
      action: "signup",
      challenge_ts: "2024-01-01T00:00:00Z",
      hostname: "localhost",
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await verifier.verify("valid_token", "signup")

    expect(result).toEqual({ success: true, score: 0.9 })
    expect(fetch).toHaveBeenCalledWith(
      "https://www.google.com/recaptcha/api/siteverify",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=valid_token`,
      })
    )
  })

  test("should throw InvalidCaptchaError when score is below threshold", async () => {
    const mockResponse = {
      success: true,
      score: 0.3,
      action: "signup",
      challenge_ts: "2024-01-01T00:00:00Z",
      hostname: "localhost",
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    await expect(verifier.verify("low_score_token", "signup")).rejects.toThrow(
      InvalidCaptchaError
    )
  })

  test("should throw InvalidCaptchaError when action does not match", async () => {
    const mockResponse = {
      success: true,
      score: 0.9,
      action: "login",
      challenge_ts: "2024-01-01T00:00:00Z",
      hostname: "localhost",
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    await expect(verifier.verify("valid_token", "signup")).rejects.toThrow(
      InvalidCaptchaError
    )
  })

  test("should throw InvalidCaptchaError when Google API returns success: false", async () => {
    const mockResponse = {
      success: false,
      "error-codes": ["invalid-input-response"],
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    await expect(verifier.verify("invalid_token", "signup")).rejects.toThrow(
      InvalidCaptchaError
    )
  })

  test("should throw InvalidCaptchaError when fetch fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(verifier.verify("valid_token", "signup")).rejects.toThrow(
      InvalidCaptchaError
    )
  })

  test("should throw InvalidCaptchaError on network error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"))

    await expect(verifier.verify("valid_token", "signup")).rejects.toThrow(
      InvalidCaptchaError
    )
  })

  test("should accept score exactly at threshold (0.5)", async () => {
    const mockResponse = {
      success: true,
      score: 0.5,
      action: "login",
      challenge_ts: "2024-01-01T00:00:00Z",
      hostname: "localhost",
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await verifier.verify("valid_token", "login")

    expect(result).toEqual({ success: true, score: 0.5 })
  })
})

import { describe, it, expect } from "vitest"
import { isTokenExpired } from "./isTokenExpired"

const makeJwt = (expSecondsFromNow: number): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow })
  )
  return `${header}.${payload}.signature`
}

describe("isTokenExpired", () => {
  it("returns true when exp is in the past", () => {
    expect(isTokenExpired(makeJwt(-60))).toBe(true)
  })

  it("returns false when exp is in the future", () => {
    expect(isTokenExpired(makeJwt(3600))).toBe(false)
  })

  it("returns true for a malformed token", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true)
  })

  it("returns true for an empty string", () => {
    expect(isTokenExpired("")).toBe(true)
  })

  it("returns true when payload has no exp claim", () => {
    const header = btoa(JSON.stringify({ alg: "HS256" }))
    const payload = btoa(JSON.stringify({ sub: "user-123" }))
    expect(isTokenExpired(`${header}.${payload}.sig`)).toBe(true)
  })

  it("returns true when payload is not valid base64 JSON", () => {
    expect(isTokenExpired("header.not-base64-json.sig")).toBe(true)
  })
})

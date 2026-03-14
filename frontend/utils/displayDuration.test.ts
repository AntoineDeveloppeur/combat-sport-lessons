import { describe, it, expect } from "vitest"
import { minutesToHoursAndMinutes, displayDuration } from "./displayDuration"

describe("displayDuration", () => {
  it("should display minutes only when below 60", () => {
    expect(displayDuration(10)).toBe("10min")
    expect(displayDuration(45)).toBe("45min")
  })

  it("should display hours and minutes when above 60", () => {
    expect(displayDuration(70)).toBe("1h 10min")
    expect(displayDuration(125)).toBe("2h 5min")
  })

  it("should display hours only when minutes are 0", () => {
    expect(displayDuration(60)).toBe("1h")
    expect(displayDuration(120)).toBe("2h")
    expect(displayDuration(180)).toBe("3h")
  })

  it("should display 'pas de durée' when duration is 0", () => {
    expect(displayDuration(0)).toBe("pas de durée")
  })

  it("should display 'pas de durée' when duration is negative", () => {
    expect(displayDuration(-1)).toBe("pas de durée")
    expect(displayDuration(-100)).toBe("pas de durée")
  })

  it("should handle decimal values by flooring them", () => {
    expect(displayDuration(65.7)).toBe("1h 5min")
    expect(displayDuration(30.9)).toBe("30min")
  })

  it("should handle very large durations", () => {
    expect(displayDuration(1440)).toBe("24h")
    expect(displayDuration(1500)).toBe("25h")
  })
})

describe("minutesToHoursAndMinutes", () => {
  it("should convert minutes above 60 correctly", () => {
    expect(minutesToHoursAndMinutes(70)).toEqual([1, 10])
    expect(minutesToHoursAndMinutes(125)).toEqual([2, 5])
  })

  it("should convert exactly 60 minutes to 1 hour", () => {
    expect(minutesToHoursAndMinutes(60)).toEqual([1, 0])
    expect(minutesToHoursAndMinutes(120)).toEqual([2, 0])
  })

  it("should convert minutes below 60 correctly", () => {
    expect(minutesToHoursAndMinutes(50)).toEqual([0, 50])
    expect(minutesToHoursAndMinutes(1)).toEqual([0, 1])
  })

  it("should return [0, 0] when duration is 0", () => {
    expect(minutesToHoursAndMinutes(0)).toEqual([0, 0])
  })

  it("should return [0, 0] when duration is negative", () => {
    expect(minutesToHoursAndMinutes(-1)).toEqual([0, 0])
    expect(minutesToHoursAndMinutes(-100)).toEqual([0, 0])
  })

  it("should handle decimal values by flooring them", () => {
    expect(minutesToHoursAndMinutes(65.7)).toEqual([1, 5])
    expect(minutesToHoursAndMinutes(30.9)).toEqual([0, 30])
  })

  it("should handle very large durations", () => {
    expect(minutesToHoursAndMinutes(1440)).toEqual([24, 0])
    expect(minutesToHoursAndMinutes(1500)).toEqual([25, 0])
  })
})

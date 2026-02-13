import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// Polyfill pour ResizeObserver (nécessaire pour Radix UI)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Nettoie après chaque test
afterEach(() => {
  cleanup()
})

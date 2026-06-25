import "@testing-library/jest-dom"
import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({ success: true, data: { items: [] } }),
  })
) as unknown as typeof fetch

afterEach(() => {
  cleanup()
})

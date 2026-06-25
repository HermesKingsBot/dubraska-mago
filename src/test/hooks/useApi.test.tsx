import { renderHook, waitFor, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useApi } from "@/hooks/useApi"

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe("useApi", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useApi())
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("returns data after successful fetch", async () => {
    const mockData = { name: "Test" }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    })
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.fetch("/api/test")
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it("returns error on failed fetch", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, error: "Not found" }),
    })
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.fetch("/api/test")
    })

    expect(result.current.error).toBe("Not found")
    expect(result.current.data).toBeNull()
  })

  it("returns error on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"))
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.fetch("/api/test")
    })

    expect(result.current.error).toBe("Network error")
  })

  it("resets state correctly", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { test: true } }),
    })
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.fetch("/api/test")
    })

    expect(result.current.data).toEqual({ test: true })

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it("includes credentials in fetch", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: null }),
    })
    const { result } = renderHook(() => useApi())

    await act(async () => {
      await result.current.fetch("/api/test")
    })

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        credentials: "include",
      })
    )
  })

  it("sets loading to true during fetch", async () => {
    let resolveFetch!: (value: unknown) => void
    mockFetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      })
    )
    const { result } = renderHook(() => useApi())

    act(() => {
      result.current.fetch("/api/test")
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await act(async () => {
      resolveFetch({
        ok: true,
        json: async () => ({ success: true, data: null }),
      })
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})

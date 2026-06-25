import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import EmptyState from "@/components/catalog/EmptyState"

describe("EmptyState", () => {
  it("renders no results message", () => {
    render(<EmptyState onClearFilters={vi.fn()} />)
    expect(screen.getByText("No encontramos resultados")).toBeInTheDocument()
  })

  it("renders suggestion text", () => {
    render(<EmptyState onClearFilters={vi.fn()} />)
    expect(
      screen.getByText(/intenta ajustar los filtros/i)
    ).toBeInTheDocument()
  })

  it("shows Limpiar filtros button", () => {
    render(<EmptyState onClearFilters={vi.fn()} />)
    expect(screen.getByText("Limpiar filtros")).toBeInTheDocument()
  })

  it("calls onClearFilters when button clicked", async () => {
    const onClearFilters = vi.fn()
    render(<EmptyState onClearFilters={onClearFilters} />)
    await userEvent.click(screen.getByText("Limpiar filtros"))
    expect(onClearFilters).toHaveBeenCalled()
  })

  it("renders search icon", () => {
    render(<EmptyState onClearFilters={vi.fn()} />)
    expect(screen.getByText("No encontramos resultados")).toBeInTheDocument()
  })
})

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import FilterChips from "@/components/catalog/FilterChips"
import { CatalogFilters } from "@/types/product"

const emptyFilters: CatalogFilters = {
  category: [],
  color: [],
  priceMin: "",
  priceMax: "",
  ofertas: false,
  nuevos: false,
  limitados: false,
}

describe("FilterChips", () => {
  it("renders active filter chips for categories", () => {
    const filters = { ...emptyFilters, category: ["collares", "pulseras"] }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(screen.getByText("collares")).toBeInTheDocument()
    expect(screen.getByText("pulseras")).toBeInTheDocument()
  })

  it("renders active filter chips for colors", () => {
    const filters = { ...emptyFilters, color: ["dorado"] }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(screen.getByText("dorado")).toBeInTheDocument()
  })

  it("renders badge chips", () => {
    const filters = { ...emptyFilters, ofertas: true, nuevos: true }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(screen.getByText("Ofertas")).toBeInTheDocument()
    expect(screen.getByText("Nuevos")).toBeInTheDocument()
  })

  it("renders price chips", () => {
    const filters = { ...emptyFilters, priceMin: "20", priceMax: "100" }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(screen.getByText("Min $20")).toBeInTheDocument()
    expect(screen.getByText("Max $100")).toBeInTheDocument()
  })

  it("calls onRemoveCategory when category chip remove button clicked", async () => {
    const onRemoveCategory = vi.fn()
    const filters = { ...emptyFilters, category: ["collares"] }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={onRemoveCategory}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    const removeBtn = screen.getByRole("button", { name: /quitar filtro collares/i })
    await userEvent.click(removeBtn)
    expect(onRemoveCategory).toHaveBeenCalledWith("collares")
  })

  it("calls onRemoveColor when color chip remove button clicked", async () => {
    const onRemoveColor = vi.fn()
    const filters = { ...emptyFilters, color: ["dorado"] }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={onRemoveColor}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    const removeBtn = screen.getByRole("button", { name: /quitar filtro dorado/i })
    await userEvent.click(removeBtn)
    expect(onRemoveColor).toHaveBeenCalledWith("dorado")
  })

  it("shows Limpiar todo when 2+ filters active", () => {
    const filters = { ...emptyFilters, category: ["collares"], color: ["dorado"] }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(screen.getByText("Limpiar todo")).toBeInTheDocument()
  })

  it("does not show Limpiar todo with only 1 filter", () => {
    const filters = { ...emptyFilters, category: ["collares"] }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(screen.queryByText("Limpiar todo")).not.toBeInTheDocument()
  })

  it("calls onClearAll when Limpiar todo clicked", async () => {
    const onClearAll = vi.fn()
    const filters = { ...emptyFilters, category: ["collares"], color: ["dorado"] }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={onClearAll}
      />
    )
    await userEvent.click(screen.getByText("Limpiar todo"))
    expect(onClearAll).toHaveBeenCalled()
  })

  it("shows limitados badge chip", () => {
    const filters = { ...emptyFilters, limitados: true }
    render(
      <FilterChips
        filters={filters}
        onRemoveCategory={vi.fn()}
        onRemoveColor={vi.fn()}
        onRemoveBadge={vi.fn()}
        onRemovePrice={vi.fn()}
        onClearAll={vi.fn()}
      />
    )
    expect(screen.getByText("Limitados")).toBeInTheDocument()
  })
})

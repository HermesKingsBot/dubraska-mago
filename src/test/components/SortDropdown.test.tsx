import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import SortDropdown from "@/components/catalog/SortDropdown"
import { SortOption } from "@/types/product"

describe("SortDropdown", () => {
  it("renders with default sort option", () => {
    render(<SortDropdown value="newest" onChange={vi.fn()} />)
    expect(screen.getByText("Más recientes")).toBeInTheDocument()
  })

  it("opens dropdown when clicked", async () => {
    render(<SortDropdown value="newest" onChange={vi.fn()} />)
    await userEvent.click(screen.getByText("Más recientes"))
    expect(screen.getByText("Más antiguos")).toBeInTheDocument()
    expect(screen.getByText("Precio: menor a mayor")).toBeInTheDocument()
    expect(screen.getByText("Precio: mayor a menor")).toBeInTheDocument()
    expect(screen.getByText("Nombre A-Z")).toBeInTheDocument()
  })

  it("calls onChange when option selected", async () => {
    const onChange = vi.fn()
    render(<SortDropdown value="newest" onChange={onChange} />)
    await userEvent.click(screen.getByText("Más recientes"))
    await userEvent.click(screen.getByText("Precio: menor a mayor"))
    expect(onChange).toHaveBeenCalledWith("price_asc" as SortOption)
  })

  it("closes dropdown after selection", async () => {
    render(<SortDropdown value="newest" onChange={vi.fn()} />)
    await userEvent.click(screen.getByText("Más recientes"))
    await userEvent.click(screen.getByText("Nombre A-Z"))
    expect(screen.queryByText("Más antiguos")).not.toBeInTheDocument()
  })

  it("shows current selection highlighted", async () => {
    render(<SortDropdown value="price_asc" onChange={vi.fn()} />)
    await userEvent.click(screen.getByText("Precio: menor a mayor"))
    const selected = screen.getAllByText("Precio: menor a mayor")
    const highlighted = selected.find((el) => el.className.includes("text-[var(--color-gold)]"))
    expect(highlighted).toBeTruthy()
  })

  it("closes dropdown when clicking outside", async () => {
    render(
      <div>
        <SortDropdown value="newest" onChange={vi.fn()} />
        <span>Outside</span>
      </div>
    )
    await userEvent.click(screen.getByText("Más recientes"))
    expect(screen.getByText("Más antiguos")).toBeInTheDocument()
    await userEvent.click(screen.getByText("Outside"))
    expect(screen.queryByText("Más antiguos")).not.toBeInTheDocument()
  })
})

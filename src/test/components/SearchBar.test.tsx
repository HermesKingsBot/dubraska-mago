import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import SearchBar from "@/components/catalog/SearchBar"

describe("SearchBar", () => {
  it("renders input with placeholder", () => {
    render(<SearchBar value="" onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText("Buscar joyas...")).toBeInTheDocument()
  })

  it("renders input with provided value", () => {
    render(<SearchBar value="oro" onSearch={vi.fn()} />)
    expect(screen.getByDisplayValue("oro")).toBeInTheDocument()
  })

  it("calls onSearch when form is submitted", async () => {
    const onSearch = vi.fn()
    render(<SearchBar value="" onSearch={onSearch} />)
    const input = screen.getByPlaceholderText("Buscar joyas...")
    await userEvent.type(input, "collar")
    fireEvent.submit(input.closest("form")!)
    expect(onSearch).toHaveBeenCalledWith("collar")
  })

  it("calls onSearch when Enter is pressed", async () => {
    const onSearch = vi.fn()
    render(<SearchBar value="" onSearch={onSearch} />)
    const input = screen.getByPlaceholderText("Buscar joyas...")
    await userEvent.type(input, "oro{Enter}")
    expect(onSearch).toHaveBeenCalledWith("oro")
  })

  it("clears input when clear button is clicked", async () => {
    const onSearch = vi.fn()
    render(<SearchBar value="" onSearch={onSearch} />)
    const input = screen.getByPlaceholderText("Buscar joyas...")
    await userEvent.type(input, "test")
    const clearButton = screen.getByRole("button", { name: /limpiar búsqueda/i })
    await userEvent.click(clearButton)
    expect(input).toHaveValue("")
    expect(onSearch).toHaveBeenCalledWith("")
  })

  it("shows clear button only when input has value", () => {
    const { rerender } = render(<SearchBar value="" onSearch={vi.fn()} />)
    expect(screen.queryByRole("button", { name: /limpiar búsqueda/i })).not.toBeInTheDocument()
    rerender(<SearchBar value="test" onSearch={vi.fn()} />)
    expect(screen.getByRole("button", { name: /limpiar búsqueda/i })).toBeInTheDocument()
  })

  it("syncs with value prop changes", () => {
    const { rerender } = render(<SearchBar value="oro" onSearch={vi.fn()} />)
    expect(screen.getByDisplayValue("oro")).toBeInTheDocument()
    rerender(<SearchBar value="plata" onSearch={vi.fn()} />)
    expect(screen.getByDisplayValue("plata")).toBeInTheDocument()
  })
})

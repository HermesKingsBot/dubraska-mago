import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import LayoutToggle from "@/components/catalog/LayoutToggle"

describe("LayoutToggle", () => {
  it("renders 3 layout buttons", () => {
    render(<LayoutToggle layout={4} onChange={vi.fn()} />)
    const buttons = screen.getAllByRole("button")
    expect(buttons.length).toBe(3)
  })

  it("renders 4 column, 2 column, 1 column buttons", () => {
    render(<LayoutToggle layout={4} onChange={vi.fn()} />)
    expect(screen.getByTitle("4 columnas")).toBeInTheDocument()
    expect(screen.getByTitle("2 columnas")).toBeInTheDocument()
    expect(screen.getByTitle("1 columna")).toBeInTheDocument()
  })

  it("highlights active layout", () => {
    render(<LayoutToggle layout={2} onChange={vi.fn()} />)
    const activeBtn = screen.getByTitle("2 columnas")
    expect(activeBtn.className).toContain("bg-[var(--color-gold)]/20")
  })

  it("calls onChange when button clicked", async () => {
    const onChange = vi.fn()
    render(<LayoutToggle layout={4} onChange={onChange} />)
    await userEvent.click(screen.getByTitle("2 columnas"))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it("calls onChange with 1 when 1 column clicked", async () => {
    const onChange = vi.fn()
    render(<LayoutToggle layout={4} onChange={onChange} />)
    await userEvent.click(screen.getByTitle("1 columna"))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it("does not highlight non-active layouts", () => {
    render(<LayoutToggle layout={4} onChange={vi.fn()} />)
    const btn2 = screen.getByTitle("2 columnas")
    const btn1 = screen.getByTitle("1 columna")
    expect(btn2.className).not.toContain("bg-[var(--color-gold)]/20")
    expect(btn1.className).not.toContain("bg-[var(--color-gold)]/20")
  })
})

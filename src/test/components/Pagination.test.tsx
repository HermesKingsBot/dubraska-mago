import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import Pagination from "@/components/catalog/Pagination"

describe("Pagination", () => {
  const defaultProps = {
    page: 1,
    totalPages: 5,
    perPage: 12 as number | "all",
    total: 50,
    onPageChange: vi.fn(),
    onPerPageChange: vi.fn(),
  }

  it("renders correct page numbers", () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("renders showing text", () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByText(/mostrando 1–12 de 50/i)).toBeInTheDocument()
  })

  it("calls onPageChange when page number clicked", async () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByText("2"))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("disables previous button on first page", () => {
    render(<Pagination {...defaultProps} page={1} />)
    const prevBtn = screen.getByText(/← ant/i)
    expect(prevBtn).toBeDisabled()
  })

  it("enables previous button when not on first page", () => {
    render(<Pagination {...defaultProps} page={2} />)
    const prevBtn = screen.getByText(/← ant/i)
    expect(prevBtn).not.toBeDisabled()
  })

  it("disables next button on last page", () => {
    render(<Pagination {...defaultProps} page={5} totalPages={5} />)
    const nextBtn = screen.getByText(/sig →/i)
    expect(nextBtn).toBeDisabled()
  })

  it("enables next button when not on last page", () => {
    render(<Pagination {...defaultProps} page={3} totalPages={5} />)
    const nextBtn = screen.getByText(/sig →/i)
    expect(nextBtn).not.toBeDisabled()
  })

  it("shows current page as active", () => {
    render(<Pagination {...defaultProps} page={2} />)
    const page2Btn = screen.getByText("2")
    expect(page2Btn.className).toContain("bg-[var(--color-gold)]")
  })

  it("calls onPageChange when prev button clicked", async () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} page={3} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByText(/← ant/i))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("calls onPageChange when next button clicked", async () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} page={3} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByText(/sig →/i))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it("hides pagination when totalPages is 1", () => {
    render(<Pagination {...defaultProps} totalPages={1} />)
    expect(screen.queryByText(/← ant/i)).not.toBeInTheDocument()
  })

  it("shows ellipsis for many pages", () => {
    render(<Pagination {...defaultProps} page={5} totalPages={20} />)
    expect(screen.getAllByText("…").length).toBeGreaterThan(0)
  })
})

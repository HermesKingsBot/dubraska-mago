import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}))

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn(),
}))

vi.mock("gsap", () => ({
  default: { fromTo: vi.fn(), set: vi.fn() },
}))

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterProps(props)}>{children}</div>
    ),
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...filterProps(props)}>{children}</button>
    ),
    h2: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <h2>{children}</h2>
    ),
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <p>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

function filterProps(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (["onClick", "className", "style", "type", "disabled", "role", "aria-label"].includes(key)) {
      filtered[key] = value
    }
  }
  return filtered
}

const mockLogin = vi.fn().mockResolvedValue({ success: true })
const mockRegister = vi.fn().mockResolvedValue({ success: true })
const mockLogout = vi.fn().mockResolvedValue(undefined)

vi.mock("@/context/CustomerAuthContext", () => ({
  useCustomerAuth: () => ({
    user: null,
    isAuthenticated: false,
    isCustomer: true,
    isLoading: false,
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
  }),
  CustomerAuthProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function importLogin() {
  return import("@/app/(auth)/login/page")
}

function importRegister() {
  return import("@/app/(auth)/register/page")
}

describe("Login Page", () => {
  it("renderiza formulario con campos email y password", async () => {
    const LoginPage = (await importLogin()).default
    render(<LoginPage />)
    expect(screen.getByPlaceholderText("tu@correo.com")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument()
  })

  it("renderiza labels del formulario", async () => {
    const LoginPage = (await importLogin()).default
    render(<LoginPage />)
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument()
    expect(screen.getByText("Contraseña")).toBeInTheDocument()
  })

  it("renderiza link a register", async () => {
    const LoginPage = (await importLogin()).default
    render(<LoginPage />)
    const registerLink = screen.getByRole("link", { name: /regístrate/i })
    expect(registerLink).toHaveAttribute("href", "/register")
  })

  it("renderiza botón de submit", async () => {
    const LoginPage = (await importLogin()).default
    render(<LoginPage />)
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument()
  })
})

describe("Register Page", () => {
  it("renderiza formulario con campos necesarios", async () => {
    const RegisterPage = (await importRegister()).default
    render(<RegisterPage />)
    expect(screen.getByPlaceholderText("Tu nombre")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("tu@correo.com")).toBeInTheDocument()
  })

  it("renderiza labels del formulario", async () => {
    const RegisterPage = (await importRegister()).default
    render(<RegisterPage />)
    expect(screen.getByText("Nombre completo")).toBeInTheDocument()
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument()
  })

  it("renderiza link a login", async () => {
    const RegisterPage = (await importRegister()).default
    render(<RegisterPage />)
    expect(screen.getByText(/¿Ya tienes cuenta/i)).toBeInTheDocument()
  })

  it("renderiza botón de crear cuenta", async () => {
    const RegisterPage = (await importRegister()).default
    render(<RegisterPage />)
    expect(screen.getByRole("button", { name: /crear cuenta/i })).toBeInTheDocument()
  })
})

describe("UserMenu", () => {
  it("muestra link Iniciar Sesión cuando no autenticado", async () => {
    const { default: UserMenu } = await import("@/components/UserMenu")
    render(<UserMenu />)
    expect(screen.getByRole("link", { name: /iniciar sesión/i })).toHaveAttribute("href", "/login")
  })
})

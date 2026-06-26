import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

vi.mock("@/lib/db", () => ({
  default: {
    order: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    cartItem: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    address: {
      findFirst: vi.fn(),
    },
    payment: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    product: {
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn(() => ({
    userId: "cust-1",
    email: "cliente@test.com",
    role: "CUSTOMER",
  })),
  requireCustomer: vi.fn(() => ({
    userId: "cust-1",
    email: "cliente@test.com",
    role: "CUSTOMER",
  })),
  requireAdmin: vi.fn(),
}))

vi.mock("@/lib/cart-utils", () => ({
  calculateCartTotal: vi.fn(() => 100),
  validateStock: vi.fn(() => ({ valid: true, errors: [] })),
  generateOrderNumber: vi.fn(() => "ORD-001"),
}))

import db from "@/lib/db"
import { GET as ordersGET, POST as ordersPOST } from "@/app/api/orders/route"
import { GET as orderGET } from "@/app/api/orders/[id]/route"
import { POST as payPOST } from "@/app/api/orders/[id]/pay/route"

function mockRequest(method: string, body?: unknown) {
  return {
    url: "http://localhost:3000/api/orders",
    method,
    json: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

function mockRequestWithParam(method: string, id: string, body?: unknown) {
  return {
    url: `http://localhost:3000/api/orders/${id}`,
    method,
    json: async () => body,
    headers: new Map(),
    cookies: { get: vi.fn(() => undefined) },
  } as unknown as NextRequest
}

const mockParamId = { params: Promise.resolve({ id: "order-1" }) }

describe("Orders API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/orders", () => {
    it("crea pedido desde carrito", async () => {
      vi.mocked(db.address.findFirst).mockResolvedValue({
        id: "addr-1",
        fullName: "Cliente",
        phone: "04121234567",
        street: "Calle 1",
        city: "Caracas",
        state: "DC",
        zipCode: "1010",
        reference: null,
      } as any)
      vi.mocked(db.cartItem.findMany).mockResolvedValue([
        {
          id: "cart-1",
          productId: "prod-1",
          quantity: 1,
          product: { id: "prod-1", name: "Collar", price: 100 },
        } as any,
      ])
      vi.mocked(db.$transaction).mockImplementation(async (fn: any) => {
        return fn({
          order: {
            create: vi.fn().mockResolvedValue({
              id: "order-1",
              orderNumber: "ORD-001",
              status: "PAYMENT_PENDING",
              items: [],
              payment: null,
            }),
          },
          product: { update: vi.fn() },
          cartItem: { deleteMany: vi.fn() },
        })
      })

      const req = mockRequest("POST", {
        addressId: "addr-1",
        shippingCarrier: "domesa",
        shippingCost: 5,
      })
      const res = await ordersPOST(req)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
    })

    it("carrito vacío retorna 400", async () => {
      vi.mocked(db.address.findFirst).mockResolvedValue({ id: "addr-1" } as any)
      vi.mocked(db.cartItem.findMany).mockResolvedValue([])

      const req = mockRequest("POST", {
        addressId: "addr-1",
        shippingCarrier: "domesa",
      })
      const res = await ordersPOST(req)
      expect(res.status).toBe(400)
    })
  })

  describe("GET /api/orders", () => {
    it("lista pedidos del usuario", async () => {
      vi.mocked(db.order.findMany).mockResolvedValue([
        {
          id: "order-1",
          orderNumber: "ORD-001",
          status: "PAYMENT_PENDING",
          items: [],
          payment: null,
        } as any,
      ])

      const req = mockRequest("GET")
      const res = await ordersGET(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data).toHaveLength(1)
    })
  })

  describe("GET /api/orders/[id]", () => {
    it("obtiene detalle del pedido", async () => {
      vi.mocked(db.order.findUnique).mockResolvedValue({
        id: "order-1",
        orderNumber: "ORD-001",
        status: "PAYMENT_PENDING",
        userId: "cust-1",
        items: [],
        payment: null,
      } as any)

      const req = mockRequestWithParam("GET", "order-1")
      const res = await orderGET(req, await mockParamId)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.data.orderNumber).toBe("ORD-001")
    })
  })

  describe("POST /api/orders/[id]/pay", () => {
    it("marca pedido como pagado", async () => {
      vi.mocked(db.order.findFirst).mockResolvedValue({
        id: "order-1",
        status: "PAYMENT_PENDING",
        userId: "cust-1",
      } as any)
      vi.mocked(db.payment.findUnique).mockResolvedValue(null)
      vi.mocked(db.payment.create).mockResolvedValue({
        id: "pay-1",
        method: "transferencia",
        amount: 100,
        status: "PENDING",
      } as any)

      const req = mockRequestWithParam("POST", "order-1", {
        orderId: "order-1",
        method: "transferencia",
        amount: 100,
      })
      const res = await payPOST(req, await mockParamId)
      const json = await res.json()

      expect(res.status).toBe(201)
      expect(json.data.method).toBe("transferencia")
    })

    it("pedido no existe retorna 404", async () => {
      vi.mocked(db.order.findFirst).mockResolvedValue(null)

      const req = mockRequestWithParam("POST", "no-existe", {
        orderId: "no-existe",
        method: "transferencia",
        amount: 100,
      })
      const res = await payPOST(req, await mockParamId)
      expect(res.status).toBe(404)
    })
  })
})

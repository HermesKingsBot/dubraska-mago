"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { useCart } from "@/context/CartContext"
import { useCustomerAuth } from "@/context/CustomerAuthContext"
import CheckoutProgress from "@/components/checkout/CheckoutProgress"
import AddressForm from "@/components/checkout/AddressForm"
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector"
import OrderSummary from "@/components/checkout/OrderSummary"
import { type CustomerAddress } from "@/types/customer"

interface AddressData {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  carrier: string
  officeCode: string
  reference: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, cartTotal, clearCart } = useCart()
  const { isAuthenticated } = useCustomerAuth()

  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])
  const [selectedAddr, setSelectedAddr] = useState<string>("new")
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [shipCost, setShipCost] = useState(0)
  const [payment, setPayment] = useState("")
  const [orderNum, setOrderNum] = useState("")
  const [creating, setCreating] = useState(false)

  const stepTransition = { type: "spring" as const, stiffness: 300, damping: 30 }

  const confettiParticles = useMemo(() =>
    Array.from({ length: 25 }).map((_, i) => ({
      left: `${(i * 4.17) % 100}%`,
      top: `${((i * 7.31) + 13) % 100}%`,
      color: i % 3 === 0 ? "var(--color-gold)" : i % 3 === 1 ? "var(--color-rose)" : "var(--color-muted)",
      duration: 2 + (i * 0.17) % 1.5,
      delay: ((i * 0.13) % 5) / 10,
      repeatDelay: ((i * 0.31) % 3),
    })), [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    fetch("/api/customer/addresses", { credentials: "include" })
      .then(r => r.json())
      .then(j => {
        if (j.success && j.data) {
          setAddresses(j.data)
          const def = j.data.find((a: CustomerAddress) => a.isDefault)
          if (def) setSelectedAddr(def.id)
        }
      })
      .catch(() => {})
  }, [isAuthenticated, router])

  const handleNewAddr = (data: AddressData) => {
    setAddressData(data)
    setSelectedAddr("new")
    setShipCost(data.carrier === "DHL" || data.carrier === "FedEx" ? 15 : 8)
    setStep(2)
  }

  const handleSelectAddr = (id: string) => {
    setSelectedAddr(id)
    const a = addresses.find(x => x.id === id)
    if (a) {
      const d: AddressData = {
        fullName: a.fullName, phone: a.phone, street: a.street,
        city: a.city, state: a.state, zipCode: a.zipCode || "",
        carrier: a.carrier || "", officeCode: a.officeCode || "",
        reference: a.reference || "",
      }
      setAddressData(d)
      setShipCost(a.carrier === "DHL" || a.carrier === "FedEx" ? 15 : 8)
    }
  }

  const createOrder = async () => {
    setCreating(true)
    try {
      const res = await fetch("/api/customer/orders", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
          shipping: addressData, shippingCost: shipCost, paymentMethod: payment,
        }),
      })
      const j = await res.json()
      if (j.success && j.data) {
        setOrderNum(j.data.orderNumber)
        setStep(4)
        await clearCart()
      }
    } catch {} finally { setCreating(false) }
  }

  if (!cartItems.length && step !== 4) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Tu carrito está vacío</h1>
          <button onClick={() => router.push("/colecciones")} className="px-6 py-3 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold text-sm hover:opacity-90 transition-opacity">Ir a la tienda</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-center mb-8" style={{ fontFamily: "var(--font-playfair)" }}>Checkout</h1>
        <CheckoutProgress currentStep={step} />
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={stepTransition}
            >
              <OrderSummary items={cartItems} subtotal={cartTotal} shippingCost={shipCost} />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold text-sm hover:brightness-110 transition-all"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Continuar
              </motion.button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={stepTransition}
              className="space-y-6"
            >
              {addresses.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Direcciones guardadas</h2>
                  <div className="space-y-2 mb-6">
                    {addresses.map(a => (
                      <motion.button
                        key={a.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectAddr(a.id)}
                        className="w-full text-left p-4 rounded-xl text-sm transition-colors"
                        style={{
                          backgroundColor: "var(--color-dark-card)",
                          border: selectedAddr === a.id ? "2px solid var(--color-gold)" : "2px solid transparent",
                        }}
                      >
                        <p className="font-medium text-[var(--color-white)]">{a.fullName}</p>
                        <p className="text-[var(--color-muted)]">{a.street}, {a.city}, {a.state}</p>
                      </motion.button>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-sm font-medium text-[var(--color-muted)] mb-3">O agregar nueva dirección</h3>
                  </div>
                </div>
              )}
              <AddressForm onSubmit={handleNewAddr} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={stepTransition}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Método de pago</h2>
                <PaymentMethodSelector selected={payment} onSelect={setPayment} />
              </div>
              <div className="sticky top-24 rounded-xl p-5" style={{ backgroundColor: "var(--color-dark-card)", boxShadow: "0 0 30px oklch(0.78 0.14 85 / 0.05)" }}>
                <OrderSummary items={cartItems} subtotal={cartTotal} shippingCost={shipCost} />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={createOrder}
                disabled={!payment || creating}
                className="w-full py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
                    Creando pedido...
                  </span>
                ) : (
                  "Crear Pedido"
                )}
              </motion.button>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center py-16 relative"
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {confettiParticles.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: p.color,
                      left: p.left,
                      top: p.top,
                    }}
                    initial={{ opacity: 0, y: 20, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], y: [20, -40], scale: [0, 1, 0.5] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatDelay: p.repeatDelay }}
                  />
                ))}
              </div>
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-gold)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-bg)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </motion.svg>
              </motion.div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: "var(--font-playfair)" }}>¡Pedido creado con éxito!</h2>
              <p className="text-[var(--color-muted)] mb-4">Número de pedido: <span className="text-[var(--color-gold)] font-mono">{orderNum}</span></p>
              <p className="text-[var(--color-muted)] text-sm mb-8">Sube tu comprobante de pago para confirmar tu pedido.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/cuenta/pedidos/${orderNum}`)}
                  className="px-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg)] font-semibold text-sm hover:brightness-110 transition-all"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Subir comprobante de pago
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/colecciones")}
                  className="px-6 py-3 rounded-xl border border-white/20 text-[var(--color-white)] font-semibold text-sm hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Seguir comprando
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

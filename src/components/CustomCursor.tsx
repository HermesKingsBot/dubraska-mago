"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const reducedRef = useRef(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedRef.current = mq.matches
    if (mq.matches || window.innerWidth <= 768) return

    setVisible(true)

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const onEnterInteractive = () => setHovering(true)
    const onLeaveInteractive = () => setHovering(false)

    const addListeners = () => {
      document.addEventListener("mousemove", onMove)
      document.querySelectorAll("a, button, [data-cursor='pointer']").forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive)
        el.addEventListener("mouseleave", onLeaveInteractive)
      })
    }

    const removeListeners = () => {
      document.removeEventListener("mousemove", onMove)
      document.querySelectorAll("a, button, [data-cursor='pointer']").forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive)
        el.removeEventListener("mouseleave", onLeaveInteractive)
      })
    }

    addListeners()
    const observer = new MutationObserver(() => {
      removeListeners()
      addListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      removeListeners()
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  if (!visible) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      >
        <motion.div
          animate={{
            width: hovering ? 40 : 8,
            height: hovering ? 40 : 8,
            borderWidth: hovering ? 2 : 0,
            borderColor: "var(--color-gold)",
            backgroundColor: hovering ? "transparent" : "var(--color-gold)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
          className="rounded-full"
        />
      </motion.div>
      <style>{`
        @media (min-width: 769px) {
          * { cursor: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}

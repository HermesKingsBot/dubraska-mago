"use client"

import { useCallback } from "react"

export interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
}

let toastListeners: Array<(toasts: Toast[]) => void> = []
let toastsState: Toast[] = []

function notify() {
  toastListeners.forEach((fn) => fn([...toastsState]))
}

export function useToast() {
  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2, 9)
    const toast: Toast = { id, type, message }
    toastsState = [...toastsState, toast]
    notify()

    setTimeout(() => {
      toastsState = toastsState.filter((t) => t.id !== id)
      notify()
    }, 3000)
  }, [])

  const success = useCallback((msg: string) => addToast("success", msg), [addToast])
  const error = useCallback((msg: string) => addToast("error", msg), [addToast])
  const info = useCallback((msg: string) => addToast("info", msg), [addToast])

  const subscribe = useCallback((fn: (toasts: Toast[]) => void) => {
    toastListeners.push(fn)
    fn([...toastsState])
    return () => {
      toastListeners = toastListeners.filter((l) => l !== fn)
    }
  }, [])

  return { success, error, info, subscribe }
}

export default useToast

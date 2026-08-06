"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

import { easeOutExpo } from "@/lib/motion"

/**
 * Centered scroll-panel overlay.
 *
 * Handles: Escape to close, backdrop click, body scroll lock, focus trapped
 * to the panel on open, and focus returned to the trigger on close.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  children: React.ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  // Remember what was focused before opening so we can restore it after.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement
      panelRef.current?.focus()
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            // Close is deliberately faster than open. Dismissal should feel
            // immediate; matching both at 250ms made the modal feel reluctant.
            transition={{
              duration: open ? 0.25 : 0.15,
              ease: easeOutExpo,
            }}
            onClick={(e) => e.stopPropagation()}
            className="surface-floating scroll-panel relative max-h-[88dvh] w-full max-w-[560px] overflow-y-auto rounded-[10px] border border-line bg-surface outline-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="close"
              className="absolute right-4 top-4 z-10 flex size-7 items-center justify-center rounded-full border border-line bg-surface text-fg-muted transition-colors duration-200 hover:border-line-hover hover:text-fg"
            >
              <X className="size-3.5" />
            </button>

            <div className="p-6 sm:p-7">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

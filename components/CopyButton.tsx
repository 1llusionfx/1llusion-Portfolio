"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Copies `value` to the clipboard and confirms inline for two seconds.
 * Falls back to doing nothing visible if the Clipboard API is unavailable
 * (insecure origin, older browser) rather than throwing.
 */
export function CopyButton({
  value,
  label = "copy",
  iconOnly = false,
  className,
}: {
  value: string
  label?: string
  iconOnly?: boolean
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      /* clipboard unavailable — no state change, no crash */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={iconOnly ? `${label} ${value}` : undefined}
      className={cn(
        "press surface-raised surface-raised-hover inline-flex items-center gap-2 rounded-(--radius-tile) border border-line bg-surface text-[13px] text-fg-secondary hover:border-line-hover hover:bg-surface-hover hover:text-fg",
        iconOnly ? "size-8 justify-center" : "px-3 py-1.5",
        className
      )}
    >
      {/* Both icons stay mounted in one grid cell and cross-fade, so the
          confirmation reads as a change of state rather than a hard cut. */}
      <span
        className="t-icon-swap size-3.5 shrink-0"
        data-state={copied ? "b" : "a"}
      >
        <Copy
          aria-hidden
          data-icon="a"
          className="t-icon size-3.5"
          strokeWidth={1.8}
        />
        <Check
          aria-hidden
          data-icon="b"
          className="t-icon size-3.5"
          strokeWidth={2}
        />
      </span>
      {iconOnly ? null : <span>{copied ? "copied" : label}</span>}
    </button>
  )
}

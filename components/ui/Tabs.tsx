"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { easeOutExpo } from "@/lib/motion"

/**
 * Full-width segmented control. The active segment is a raised surface that
 * slides between positions via a shared layout id.
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: readonly T[]
  value: T
  onChange: (next: T) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "surface-raised flex rounded-(--radius-card) border border-line bg-surface p-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const active = tab === value
        return (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab)}
            className={cn(
              "relative flex-1 rounded-(--radius-tile) px-3 py-2 text-[13px] transition-colors duration-200",
              active ? "text-fg" : "text-fg-muted hover:text-fg-secondary"
            )}
          >
            {active ? (
              <motion.span
                layoutId="tab-indicator"
                transition={{ duration: 0.25, ease: easeOutExpo }}
                className="absolute inset-0 rounded-(--radius-tile) border border-line bg-surface-raised"
              />
            ) : null}
            <span className="relative z-10">{tab}</span>
          </button>
        )
      })}
    </div>
  )
}

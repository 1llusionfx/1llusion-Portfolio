"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export type AccordionItem = {
  q: string
  a: string
}

/**
 * Hairline-separated disclosure list. One item open at a time.
 *
 * Height animates via `grid-template-rows: 0fr → 1fr` rather than measuring
 * `height: auto` in JS. No measurement pass, no layout thrash, and it works
 * with content whose height changes after mount.
 *
 * The chevron flips with `scaleY(-1)` instead of morphing its path — CSS `d:`
 * interpolation is Chromium-only, while a vertical flip passes through the
 * same flat midpoint in every browser.
 */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="t-acc" data-open={isOpen}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
            >
              <span
                className={cn(
                  "text-[14px] transition-colors duration-200",
                  isOpen ? "text-fg" : "text-fg-secondary"
                )}
              >
                {item.q}
              </span>
              <span
                className={cn(
                  "t-acc-chevron shrink-0 transition-colors duration-200",
                  isOpen ? "text-fg-muted" : "text-fg-faint"
                )}
              >
                <ChevronDown aria-hidden className="size-4" strokeWidth={2} />
              </span>
            </button>

            {/* Padding sits on the inner element — on the 0fr track it would
                leave a residual strip so the panel never fully closed. */}
            <div className="t-acc-panel">
              <div className="t-acc-panel-inner">
                <p className="pb-4 pr-8 text-[13px] leading-relaxed text-fg-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

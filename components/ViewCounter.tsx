"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Eye } from "lucide-react"

import { easeOutExpo } from "@/lib/motion"
import { AnimatedDigits } from "@/components/ui/AnimatedDigits"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Floating view count, bottom-right.
 *
 * Talks to /api/views, which decides between Upstash Redis and the public
 * fallback service. If the route errors the pill simply never renders.
 */
export function ViewCounter() {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/views", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && typeof json?.views === "number") setViews(json.views)
      })
      .catch(() => {
        /* counter unavailable — stay hidden */
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (views === null) return null

  const pill = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.3 }}
      // No `pointer-events-none` here any more — the tooltip needs the pill to
      // be hoverable to explain what the number counts.
      className="surface-floating fixed bottom-4 right-4 z-40 hidden cursor-default items-center gap-1.5 rounded-full border border-line bg-surface/85 px-2.5 py-1.5 font-mono text-[11px] text-fg-muted backdrop-blur-xl transition-colors duration-200 hover:border-line-hover hover:text-fg-secondary sm:flex"
    >
      <Eye aria-hidden className="size-3" strokeWidth={1.5} />

      {/* Staggered here — the count arrives all at once, so a little cascade
          reads well. The Spotify clock uses the same component without it. */}
      <AnimatedDigits
        value={views.toLocaleString()}
        stagger={0.03}
        className="text-fg-secondary"
      />

      <span>{views === 1 ? "view" : "views"}</span>
    </motion.div>
  )

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{pill}</TooltipTrigger>
        <TooltipContent side="left" className="max-w-[220px] normal-case">
          <span className="block text-fg">total page loads</span>
          <span className="mt-0.5 block text-fg-muted">
            counted server-side, this visit included — not unique visitors
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

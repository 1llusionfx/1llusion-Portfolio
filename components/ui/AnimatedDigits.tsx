"use client"

import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

/**
 * Per-digit number pop-in.
 *
 * Each character is keyed by position *and* value, so only digits that
 * actually changed remount and animate — a clock ticking 1:04 → 1:05 moves
 * one digit, not five.
 *
 * `stagger` is for values that land all at once (a view count arriving). Leave
 * it at 0 for anything ticking on a timer: a staggered clock would still be
 * animating when the next second arrives.
 */
export function AnimatedDigits({
  value,
  className,
  stagger = 0,
  duration = 0.45,
}: {
  value: string
  className?: string
  stagger?: number
  duration?: number
}) {
  return (
    <span className={cn("inline-flex tabular-nums", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {value.split("").map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{
              duration,
              ease: [0.34, 1.45, 0.64, 1],
              delay: i * stagger,
            }}
            className="inline-block"
          >
            {/* separators would otherwise collapse in a flex row */}
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

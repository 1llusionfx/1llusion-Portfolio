"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { containerVariants } from "@/lib/motion"

/**
 * Every page mounts into this. Holds the narrow reading column, the entry
 * stagger, and the padding that keeps content clear of the nav rail.
 *
 * Vertical centring uses `my-auto` on the child rather than `items-center`
 * on the parent. Both centre short pages, but `items-center` clips the top of
 * content taller than the viewport — `my-auto` degrades to normal flow and
 * stays scrollable. So one rule covers every page: short pages (skills,
 * contact, biolinks) sit centred, long ones (setup, music) run top to bottom.
 */
export function PageShell({
  children,
  className,
  /**
   * "top" pins the column to the top instead of centring it. Use it wherever
   * content height changes at runtime — with `my-auto`, swapping a tall panel
   * for a short one re-centres the whole page, so the heading and tabs visibly
   * slide. Pinning keeps everything above the changing region fixed.
   */
  anchor = "center",
  /**
   * "wide" gives multi-column pages room so text doesn't wrap after two or
   * three words in a narrow sub-column. Single-column pages stay at the
   * default reading measure.
   */
  width = "default",
}: {
  children: React.ReactNode
  className?: string
  anchor?: "center" | "top"
  width?: "default" | "wide"
}) {
  return (
    <main
      className={cn(
        "flex min-h-dvh w-full justify-center",
        // clears the bottom nav bar on mobile, the left rail on desktop
        "px-5 pb-28 pt-16 sm:px-[88px] sm:py-16"
      )}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={cn(
          "w-full space-y-10",
          width === "wide" ? "max-w-[880px]" : "max-w-[680px]",
          anchor === "center" ? "my-auto" : "mb-auto",
          className
        )}
      >
        {children}
      </motion.div>
    </main>
  )
}

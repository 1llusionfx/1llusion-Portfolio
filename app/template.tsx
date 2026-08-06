"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { easeOutExpo } from "@/lib/motion"

/**
 * A template (not a layout) remounts on every navigation, which is what makes
 * the enter animation replay per route.
 *
 * The scroll reset is explicit and synchronous: leaving a long page part-way
 * down and landing on a short one otherwise renders at the old offset for a
 * frame before the browser corrects it, which read as the page flying in from
 * below. useLayoutEffect puts the reset before paint.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  )
}

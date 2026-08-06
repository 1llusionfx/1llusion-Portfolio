import type { Variants } from "framer-motion"

/** Shared easing — matches the token in globals.css */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const

/** Applied to the page container; staggers its direct children. */
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
}

/** Applied to each direct child of a container. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
}

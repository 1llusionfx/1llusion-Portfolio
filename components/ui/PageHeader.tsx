"use client"

import { motion } from "framer-motion"

import { itemVariants } from "@/lib/motion"
import { Eyebrow } from "./Eyebrow"
import { SerifAccent } from "./SerifAccent"

/**
 * The opening block of every page: eyebrow → title → description.
 * `descriptionWidth` keeps the paragraph wrapping early, as in the reference.
 */
export function PageHeader({
  eyebrow,
  title,
  titleAccent,
  description,
}: {
  eyebrow: string
  title: string
  titleAccent?: string
  description?: string
}) {
  return (
    <motion.header variants={itemVariants} className="space-y-3">
      <Eyebrow>{eyebrow}</Eyebrow>

      <h1 className="text-[34px] font-bold lowercase leading-none tracking-tight text-fg">
        <SerifAccent text={title} accent={titleAccent} />
      </h1>

      {description ? (
        <p className="max-w-[46ch] pt-1 text-[15px] leading-relaxed text-fg-secondary">
          {description}
        </p>
      ) : null}
    </motion.header>
  )
}

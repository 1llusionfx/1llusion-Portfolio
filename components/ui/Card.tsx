import React from "react"

import { cn } from "@/lib/utils"

type CardProps = {
  children: React.ReactNode
  className?: string
  interactive?: boolean
  as?: React.ElementType
} & React.HTMLAttributes<HTMLElement> &
  Record<string, unknown>

/**
 * Base surface. Every other card primitive composes this.
 * Extra props (href, target, onClick…) forward to the rendered element.
 */
export function Card({
  children,
  className,
  interactive = false,
  as: Tag = "div",
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "surface-raised rounded-(--radius-card) border border-line bg-surface",
        interactive &&
          "press surface-raised-hover hover:border-line-hover hover:bg-surface-hover",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

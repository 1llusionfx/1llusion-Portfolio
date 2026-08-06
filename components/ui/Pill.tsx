import React from "react"

import { cn } from "@/lib/utils"

type PillProps = {
  children: React.ReactNode
  /** rendered after a middot in muted text */
  note?: string
  icon?: React.ReactNode
  href?: string
  /** inverted fill — reserve for the single primary action on a page */
  primary?: boolean
  className?: string
  onClick?: () => void
}

/**
 * The workhorse tag. Renders as a link, a button, or a static chip
 * depending on which props are supplied.
 *
 * Padding is deliberately asymmetric when an icon is present: a glyph carries
 * less optical weight than a text edge, so equal padding makes the pair look
 * left-heavy. Tightening the icon side and opening the text side centres the
 * content to the eye rather than to the box.
 */
export function Pill({
  children,
  note,
  icon,
  href,
  primary = false,
  className,
  onClick,
}: PillProps) {
  const interactive = Boolean(href || onClick)

  const classes = cn(
    "group inline-flex items-center gap-2 rounded-full border py-1.5 text-[13px]",
    icon ? "pl-2.5 pr-3.5" : "px-3.5",
    primary
      ? "border-white/20 bg-fg text-bg hover:bg-white"
      : "surface-raised border-line bg-surface text-fg-secondary",
    interactive &&
      !primary &&
      "press surface-raised-hover hover:border-line-hover hover:bg-surface-hover hover:text-fg",
    className
  )

  const content = (
    <>
      {icon ? (
        <span className="flex shrink-0 items-center text-fg-muted transition-colors duration-200 group-hover:text-fg [&_svg]:size-3.5">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {note ? (
        <span className={cn("text-fg-muted", primary && "text-bg/60")}>
          <span aria-hidden className="mr-1.5">
            ·
          </span>
          {note}
        </span>
      ) : null}
    </>
  )

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:")
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    )
  }

  return <span className={classes}>{content}</span>
}

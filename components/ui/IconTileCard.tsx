"use client"

import { ChevronRight, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "./Card"
import { DynamicIcon } from "./DynamicIcon"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/**
 * Two-column card used by /setup: icon tile, name, dot-separated meta,
 * trailing chevron. Becomes a link when `href` is supplied.
 *
 * Linked cards get a tooltip naming the destination host, so it's obvious
 * where a click lands before you take it.
 */
export function IconTileCard({
  name,
  icon,
  meta,
  href,
}: {
  name: string
  icon: string
  meta: string[]
  href?: string
}) {
  const body = (
    <div className="flex items-center gap-3 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-(--radius-tile) border border-line bg-surface-raised text-fg-secondary transition-colors duration-200 group-hover:text-fg">
        <DynamicIcon name={icon} className="size-[18px]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-fg">{name}</div>
        <div className="mt-0.5 truncate font-mono text-[11px] text-fg-muted">
          {meta.map((part, i) => (
            <span key={i}>
              {i > 0 ? <span aria-hidden className="mx-1.5">·</span> : null}
              {part}
            </span>
          ))}
        </div>
      </div>

      <ChevronRight
        aria-hidden
        className={cn(
          "size-4 shrink-0 text-fg-faint transition-transform duration-200",
          href && "group-hover:translate-x-0.5 group-hover:text-fg-muted"
        )}
      />
    </div>
  )

  if (!href) return <Card className="group">{body}</Card>

  const host = (() => {
    try {
      return new URL(href).hostname.replace(/^www\./, "")
    } catch {
      return href
    }
  })()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          as="a"
          interactive
          className="press group block"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {body}
        </Card>
      </TooltipTrigger>
      <TooltipContent side="top" className="normal-case">
        <span className="flex items-center gap-1.5">
          <ExternalLink aria-hidden className="size-3" strokeWidth={1.8} />
          {host}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

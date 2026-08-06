import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "./Card"

/**
 * Full-width row used by the "past collabs" list on /projects.
 * Biolinks use BiolinkRow instead, which adds the blurred favicon wash.
 *
 * `stacked` drops the leading tile and lets the description wrap, for narrow
 * columns where a single truncated line reads as broken.
 */
export function ListRow({
  title,
  display,
  description,
  href,
  stacked = false,
}: {
  title: string
  /** muted text sitting inline after the title (a url, a year…) */
  display?: string
  description?: string
  href?: string
  stacked?: boolean
}) {
  const body = (
    <div
      className={cn(
        "flex gap-3.5 p-3.5",
        stacked ? "items-start" : "items-center"
      )}
    >
      {stacked ? null : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-tile) border border-line bg-surface-raised">
          <span className="font-mono text-sm lowercase text-fg-muted">
            {title.charAt(0)}
          </span>
        </div>
      )}

      {/* Both halves shrink; the title is never squeezed out by a long url. */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="min-w-0 shrink-0 truncate text-[15px] font-medium text-fg">
            {title}
          </span>
          {display ? (
            <span className="min-w-0 truncate font-mono text-[11px] text-fg-muted">
              {display}
            </span>
          ) : null}
        </div>
        {description ? (
          <p
            className={cn(
              "mt-1 text-[13px] leading-relaxed text-fg-secondary",
              stacked ? "line-clamp-2" : "truncate"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      <ChevronRight
        aria-hidden
        className={cn(
          "size-4 shrink-0 text-fg-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg-muted",
          stacked && "mt-0.5"
        )}
      />
    </div>
  )

  if (!href) return <Card className="group">{body}</Card>

  return (
    <Card
      as="a"
      interactive
      className="group block"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {body}
    </Card>
  )
}

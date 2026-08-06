"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"

import type { Biolink } from "@/content/biolinks"

/**
 * Biolink row.
 *
 * The site's own favicon does double duty: sharp in the tile, and blown up +
 * blurred behind the row as a colour wash, so each row picks up its service's
 * palette without a hardcoded per-brand colour.
 *
 * Favicons load through /api/favicon rather than straight from DuckDuckGo.
 * DDG answers unknown domains with 404 plus a valid generic-globe image, which
 * a browser decodes happily — `onError` never fires and the placeholder sticks.
 * The proxy honours the status so the letter fallback works.
 */
export function BiolinkRow({ link }: { link: Biolink }) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const domain = new URL(link.href).hostname
  const src = link.icon ?? `/api/favicon?domain=${encodeURIComponent(domain)}`
  const showIcon = !failed

  // The browser can finish (and fail) the request before React hydrates and
  // attaches onError, which leaves a broken-image glyph that never recovers.
  // Re-check the decoded size once on mount to catch that race.
  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="press surface-raised surface-raised-hover group relative isolate block overflow-hidden rounded-(--radius-card) border border-line bg-surface hover:border-line-hover"
    >
      {showIcon ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -left-8 top-1/2 -z-10 size-40 -translate-y-1/2 opacity-[0.18] blur-2xl saturate-150 transition-opacity duration-500 group-hover:opacity-30"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : null}

      <span className="relative flex items-center gap-3.5 p-3.5">
        <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-(--radius-tile) border border-line bg-surface-raised">
          {showIcon ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              ref={imgRef}
              src={src}
              alt=""
              width={20}
              height={20}
              onError={() => setFailed(true)}
              className="size-5 object-contain"
            />
          ) : (
            <span className="font-mono text-[15px] font-medium lowercase text-fg-secondary">
              {link.name.charAt(0)}
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="min-w-0 shrink-0 truncate text-[15px] font-medium text-fg">
              {link.name}
            </span>
            <span className="min-w-0 truncate font-mono text-[11px] text-fg-muted">
              {link.display}
            </span>
          </span>
          {link.note ? (
            <span className="mt-0.5 block truncate text-[13px] text-fg-secondary">
              {link.note}
            </span>
          ) : null}
        </span>

        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-fg-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-fg-muted"
        />
      </span>
    </a>
  )
}

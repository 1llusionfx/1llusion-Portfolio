"use client"

import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Card } from "./Card"

/**
 * Large project card: preview image, then title, description, and actions.
 * If the image is missing or fails, the slot degrades to a neutral wordmark
 * panel rather than a broken-image icon.
 *
 * `compact` shortens the preview and tightens the padding, for layouts that
 * need the whole card to fit inside one viewport.
 */
export function FeaturedCard({
  name,
  description,
  image,
  href,
  secondary,
  compact = false,
}: {
  name: string
  description: string
  image: string | null
  href: string
  secondary?: { label: string; href: string }
  compact?: boolean
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const showFallback = !image || imageFailed

  return (
    <Card className="group flex h-full flex-col overflow-hidden">
      <div
        className={cn(
          "relative w-full shrink-0 border-b border-line bg-surface-raised",
          compact ? "aspect-[16/10]" : "aspect-[16/9]"
        )}
      >
        {showFallback ? (
          <div className="flex size-full items-center justify-center">
            <span className="font-serif text-4xl lowercase italic text-fg-faint">
              {name}
            </span>
          </div>
        ) : (
          <span className="absolute inset-0 overflow-hidden">
            <span className="zoom-layer absolute inset-0">
              <Image
                src={image}
                alt={`${name} preview`}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
                onError={() => setImageFailed(true)}
              />
            </span>
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-2",
          compact ? "p-4" : "space-y-2 p-5"
        )}
      >
        <h3 className="text-[17px] font-semibold lowercase text-fg">{name}</h3>
        <p className="flex-1 text-[14px] leading-relaxed text-fg-secondary">
          {description}
        </p>

        <div className="flex items-center justify-between gap-4 pt-1">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link -my-2 inline-flex items-center gap-1.5 py-2 text-[13px] text-fg-secondary transition-colors duration-200 hover:text-fg"
          >
            view project
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover/link:translate-x-0.5"
            >
              ›
            </span>
          </a>

          {secondary ? (
            <a
              href={secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-[13px] text-fg-muted transition-colors duration-200 hover:text-fg"
            >
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

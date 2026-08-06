"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import type { Spotify } from "@/components/DiscordStatus"
import { usePosition } from "@/components/spotify/useLyrics"
import { easeOutExpo } from "@/lib/motion"
import { AnimatedDigits } from "@/components/ui/AnimatedDigits"
import { BrandIcon } from "@/components/ui/BrandIcon"

/**
 * Live Spotify card: artwork, track, and progress.
 *
 * Lyrics live in SpotifyLyrics so they can sit in their own column — keeping
 * them here made the card a quarter of the hero's height.
 */

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

export function SpotifyWidget({ spotify }: { spotify: Spotify | null }) {
  const position = usePosition(spotify)

  // Nothing playing renders nothing. The card sits in normal flow, so
  // appearing reads as content arriving rather than a hole opening.
  if (!spotify) return null

  const total = (spotify.timestamps.end - spotify.timestamps.start) / 1000
  const progress = Math.min(100, Math.max(0, (position / total) * 100))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="surface-raised relative isolate overflow-hidden rounded-(--radius-card) border border-line bg-surface p-3"
    >
      <div className="flex items-center gap-3">
        <span className="relative size-11 shrink-0 overflow-hidden rounded-(--radius-tile) border border-line">
          <Image
            src={spotify.album_art_url}
            alt={`${spotify.album} cover`}
            fill
            sizes="44px"
            unoptimized
            className="object-cover"
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-fg-muted">
            <BrandIcon name="spotify" className="size-3" />
            <span className="font-mono text-[10px] uppercase tracking-wide">
              now playing
            </span>
          </div>
          <div className="mt-0.5 truncate text-[14px] font-medium text-fg">
            {spotify.song}
          </div>
          <div className="truncate text-[12px] text-fg-muted">
            {spotify.artist}
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-fg-faint">
          {/* only the digits that change actually animate */}
          <AnimatedDigits value={formatTime(position)} />
          <span aria-hidden>/</span>
          <span className="tabular-nums">{formatTime(total)}</span>
        </span>
      </div>

      {/* progress sits on the card's bottom edge as a hairline */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 bg-surface-raised"
      >
        <span
          className="block h-full bg-fg-secondary transition-[width] duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </span>
    </motion.div>
  )
}

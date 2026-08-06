"use client"

import { AnimatePresence, motion } from "framer-motion"
import { MicVocal } from "lucide-react"

import type { Spotify } from "@/components/DiscordStatus"
import {
  currentLineIndex,
  usePosition,
  type Line,
} from "@/components/spotify/useLyrics"
import { easeOutExpo } from "@/lib/motion"

/**
 * Time-synced lyrics panel.
 *
 * Shows a three-line window — the line before, the current one, and the next.
 * Enough context to follow along without becoming a wall of text.
 *
 * `lines` is fetched by the parent rather than here, because the parent needs
 * to know whether lyrics exist *before* it decides to lay out a column for
 * them — plenty of smaller releases have no lrclib transcription, and
 * reserving a column for an absent panel squeezed the content beside it.
 */

/** Each visible line carries its absolute index so Framer can track it. */
type Slot = { index: number; line: Line; current: boolean }

function buildWindow(lines: Line[], index: number): Slot[] {
  // Before the first timestamp there's no current line yet — show the
  // opening line as upcoming rather than an empty panel.
  if (index < 0) {
    return lines[0] ? [{ index: 0, line: lines[0], current: false }] : []
  }

  return [index - 1, index, index + 1]
    .filter((i) => i >= 0 && i < lines.length)
    .map((i) => ({ index: i, line: lines[i], current: i === index }))
}

export function SpotifyLyrics({
  spotify,
  lines,
}: {
  spotify: Spotify | null
  lines: Line[]
}) {
  const position = usePosition(spotify)

  if (!spotify || lines.length === 0) return null

  const index = currentLineIndex(lines, position)
  const window = buildWindow(lines, index)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      // No `h-full`: the grid is items-start, so the card sits at its natural
      // height instead of stretching to match a taller left column.
      className="surface-raised t-resize flex flex-col gap-2.5 overflow-hidden rounded-(--radius-card) border border-line bg-surface p-4"
    >
      <div className="flex items-center gap-1.5 text-fg-muted">
        <MicVocal aria-hidden className="size-3" strokeWidth={1.8} />
        <span className="font-mono text-[10px] uppercase tracking-wide">
          lyrics
        </span>
      </div>

      {/*
        The whole stack scrolls rather than only the middle line swapping.
        `layout` on each line is what does it: when the window advances, the
        outgoing line exits upward and the survivors animate from their old
        positions to their new ones, so the block moves as one. `popLayout`
        pulls exiting lines out of flow first, otherwise the survivors wait
        for the exit to finish and the motion stutters.
      */}
      {/*
        Fixed height, not min-height. Sized for a two-line current lyric plus
        one-line neighbours — the realistic worst case. A long line therefore
        costs nothing: the current line clamps to two, neighbours truncate to
        one, and the panel never resizes mid-song. Height only ever changes
        when lyrics appear or disappear, which `.t-resize` smooths.
      */}
      <div className="relative flex h-[84px] flex-col justify-center gap-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {window.map(({ index: i, line, current }) => (
            <motion.p
              key={i}
              layout
              initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
              animate={{
                opacity: current ? 1 : 0.32,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{ opacity: 0, y: -14, filter: "blur(5px)" }}
              transition={{
                duration: 0.42,
                ease: easeOutExpo,
                layout: { duration: 0.42, ease: easeOutExpo },
              }}
              className={
                current
                  ? "line-clamp-2 text-[13px] font-medium leading-snug text-fg"
                  : "truncate text-[12px] leading-snug text-fg-secondary"
              }
            >
              {line.text || "♪"}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

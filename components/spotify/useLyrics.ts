"use client"

import { useEffect, useRef, useState } from "react"

import type { Spotify } from "@/components/DiscordStatus"

export type Line = { time: number; text: string }

/**
 * Time-synced lyrics for the current track, via /api/lyrics (lrclib).
 *
 * Refetches only when the track id changes, not on every presence poll —
 * lyrics for a given track never change, and the route caches them for a day.
 */
export function useLyrics(spotify: Spotify | null) {
  const [lines, setLines] = useState<Line[]>([])
  const trackRef = useRef<string | null>(null)

  useEffect(() => {
    if (!spotify) {
      setLines([])
      trackRef.current = null
      return
    }
    if (trackRef.current === spotify.track_id) return

    trackRef.current = spotify.track_id
    setLines([])

    const duration = Math.round(
      (spotify.timestamps.end - spotify.timestamps.start) / 1000
    )
    const query = new URLSearchParams({
      artist: spotify.artist,
      track: spotify.song,
      duration: String(duration),
    })

    let cancelled = false
    fetch(`/api/lyrics?${query}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && Array.isArray(json.lines)) setLines(json.lines)
      })
      .catch(() => {
        /* no lyrics available — callers render nothing */
      })

    return () => {
      cancelled = true
    }
  }, [spotify])

  return lines
}

/**
 * Playback position in seconds.
 *
 * Derived locally from Lanyard's `timestamps.start` (a real epoch value)
 * rather than polled, so the lyric lands on the beat even though presence
 * only refreshes every 10 seconds.
 */
export function usePosition(spotify: Spotify | null) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!spotify) return

    const tick = () =>
      setPosition((Date.now() - spotify.timestamps.start) / 1000)

    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [spotify])

  return position
}

/** Index of the last line whose timestamp has passed. */
export function currentLineIndex(lines: Line[], position: number) {
  let index = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= position) index = i
    else break
  }
  return index
}

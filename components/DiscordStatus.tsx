"use client"

import { useEffect, useState } from "react"
import NextImage from "next/image"

import { site } from "@/content/site"

type LanyardData = {
  discord_user: {
    id: string
    username: string
    avatar: string | null
  }
  discord_status: "online" | "idle" | "dnd" | "offline"
  listening_to_spotify: boolean
  spotify: {
    track_id: string
    song: string
    artist: string
    album: string
    album_art_url: string
    timestamps: { start: number; end: number }
  } | null
  activities: Array<{
    name: string
    state?: string
    details?: string
    type: number
  }>
}

export type Activity = {
  name: string
  details: string | null
  state: string | null
  /** 2 = listening, per Discord's activity types */
  type: number
}

export type Spotify = NonNullable<LanyardData["spotify"]>

export type Presence = {
  status: LanyardData["discord_status"]
  activity: Activity | null
  spotify: Spotify | null
  avatarUrl: string | null
  /** false until Lanyard answers — render a placeholder, not a stale avatar */
  ready: boolean
}

/**
 * Single shared poll.
 *
 * Presence is read in several places at once — the avatar, the activity line,
 * the Spotify card, the page backdrop. If each called `fetch` on its own timer
 * they'd hammer Lanyard and drift out of sync with each other. One module-level
 * store polls once and pushes to every subscriber, so all consumers show the
 * same state at the same instant.
 *
 * The cache also survives navigation, which is what stops the bundled
 * /pfp.jpg flashing before the real Discord avatar on each route change.
 */
type Snapshot = Omit<Presence, "ready">

let cached: Snapshot | null = null
const subscribers = new Set<(value: Snapshot) => void>()
let timer: ReturnType<typeof setInterval> | null = null

/** Long enough to be polite to Lanyard, short enough to catch track changes. */
const POLL_MS = 10_000

function publish(next: Snapshot) {
  cached = next
  subscribers.forEach((fn) => fn(next))
}

async function load() {
  try {
    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${site.discordId}`
    )
    const json = await res.json()
    if (!json?.success) return

    const data = json.data as LanyardData
    // type 4 is the custom status, type 2 is Spotify — both rendered elsewhere
    const raw =
      data.activities?.find((a) => a.type !== 4 && a.type !== 2) ?? null

    publish({
      status: data.discord_status,
      activity: raw
        ? {
            name: raw.name,
            details: raw.details ?? null,
            state: raw.state ?? null,
            type: raw.type,
          }
        : null,
      spotify: data.listening_to_spotify ? data.spotify : null,
      avatarUrl: data.discord_user?.avatar
        ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`
        : site.avatar,
    })
  } catch {
    // offline / blocked / rate-limited — fall back to the bundled avatar
    // rather than leaving the placeholder up forever
    if (cached) return
    publish({
      status: "offline",
      activity: null,
      spotify: null,
      avatarUrl: site.avatar,
    })
  }
}

function subscribe(fn: (value: Snapshot) => void) {
  subscribers.add(fn)

  if (timer === null) {
    load()
    timer = setInterval(load, POLL_MS)
  }

  return () => {
    subscribers.delete(fn)
    // Stop polling once the last consumer unmounts.
    if (subscribers.size === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }
}

export function useDiscordPresence(): Presence {
  const [presence, setPresence] = useState<Snapshot | null>(cached)

  useEffect(() => subscribe(setPresence), [])

  return {
    status: presence?.status ?? "offline",
    activity: presence?.activity ?? null,
    spotify: presence?.spotify ?? null,
    avatarUrl: presence?.avatarUrl ?? null,
    ready: presence !== null,
  }
}

/** Avatar that shows a neutral tile until the real one is known. */
export function DiscordAvatar({
  url,
  ready,
  sizes,
  className = "",
}: {
  url: string | null
  ready: boolean
  sizes: string
  className?: string
}) {
  if (!ready || !url) {
    return (
      <span
        className={`block size-full animate-pulse rounded-full bg-surface-raised ${className}`}
      />
    )
  }

  return (
    <NextImage
      src={url}
      alt=""
      fill
      sizes={sizes}
      className={`rounded-full object-cover grayscale ${className}`}
    />
  )
}

const label: Record<Presence["status"], string> = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
}

/**
 * Monochrome status glyph. Since there's no hue to carry meaning, each state
 * gets a distinct shape — the same way Discord's own accessibility mode works.
 */
export function StatusDot({
  status,
  className = "",
}: {
  status: Presence["status"]
  className?: string
}) {
  return (
    <span
      role="img"
      aria-label={label[status]}
      title={label[status]}
      className={className}
    >
      <svg viewBox="0 0 24 24" className="size-full">
        {status === "online" ? (
          <circle cx="12" cy="12" r="9" fill="#ededed" />
        ) : null}

        {status === "idle" ? (
          <path
            fill="#a1a1a1"
            d="M11 3.04C7.6 3.9 5 6.9 5 10.5A8.5 8.5 0 0 0 13.5 19c3.6 0 6.6-2.6 7.46-6a7 7 0 0 1-9.96-9.96Z"
          />
        ) : null}

        {status === "dnd" ? (
          <>
            <circle cx="12" cy="12" r="9" fill="#a1a1a1" />
            <rect x="7" y="10.25" width="10" height="3.5" rx="1.75" fill="#0a0a0a" />
          </>
        ) : null}

        {status === "offline" ? (
          <>
            <circle cx="12" cy="12" r="9" fill="#4a4a4a" />
            <circle cx="12" cy="12" r="4" fill="#0a0a0a" />
          </>
        ) : null}
      </svg>
    </span>
  )
}

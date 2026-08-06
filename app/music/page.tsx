"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Disc3 } from "lucide-react"

import type {
  Album,
  Artist,
  MusicPayload,
  Stats,
  Track,
} from "@/lib/lastfm-types"
import { itemVariants } from "@/lib/motion"
import { PageShell } from "@/components/layout/PageShell"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/ui/PageHeader"
import { Tabs } from "@/components/ui/Tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const TABS = ["Albums", "Tracks", "Artists", "Stats"] as const
type Tab = (typeof TABS)[number]

export default function MusicPage() {
  const [tab, setTab] = useState<Tab>("Albums")
  const [data, setData] = useState<MusicPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    // Hits our own route, not Last.fm — the API key stays on the server.
    fetch("/api/lastfm")
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? `request failed (${res.status})`)
        return json as MusicPayload
      })
      .then((payload) => {
        if (!cancelled) setData(payload)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    // Pinned to the top: the tab panel changes height as you switch tabs, and
    // a centred column would re-centre on every switch, sliding the heading
    // and the tab bar around.
    <PageShell anchor="top" className="space-y-6">
      <PageHeader
        eyebrow="my taste"
        title="music"
        description="what's been on repeat for the past month"
      />

      <motion.div variants={itemVariants}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </motion.div>

      {/* floor height so the shortest tab (Stats) doesn't leave the panel
          stranded directly under the tab bar */}
      <motion.div variants={itemVariants} className="min-h-[320px]">
        {error ? (
          <Notice title="couldn't reach last.fm" body={error} />
        ) : !data ? (
          <Skeleton tab={tab} />
        ) : tab === "Albums" ? (
          // 4 x 3
          <AlbumGrid albums={data.albums.slice(0, 12)} />
        ) : tab === "Tracks" ? (
          <MediaRows items={data.tracks.slice(0, 10)} kind="track" />
        ) : tab === "Artists" ? (
          <MediaRows items={data.artists.slice(0, 10)} kind="artist" />
        ) : (
          <StatGrid stats={data.stats} />
        )}
      </motion.div>
    </PageShell>
  )
}

/* ------------------------------------------------------------------ albums */

function AlbumGrid({ albums }: { albums: Album[] }) {
  if (albums.length === 0) return <Notice title="nothing scrobbled yet" />

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {albums.map((album, i) => (
        <motion.a
          key={`${album.artist}-${album.name}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: Math.min(i, 12) * 0.04 }}
          href={album.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${album.name} — ${album.artist}`}
          // No `.press` here — its translateY would run on the same element as
          // the zooming image, and nested transforms on different clocks make
          // the tile shimmer. Hover feedback is the zoom and border alone.
          className="surface-raised surface-raised-hover group relative aspect-square overflow-hidden rounded-(--radius-card) border border-line bg-surface"
        >
          <AlbumArt album={album} />
        </motion.a>
      ))}
    </div>
  )
}

/**
 * Album art is already 300x300 from Last.fm/Deezer, so `unoptimized` skips a
 * pointless re-encode — and stops their CDNs' own 404s surfacing as 500s from
 * our image optimiser.
 *
 * The zoom lives on a wrapper, not on the `fill` image: transforming an
 * inset-0 absolute element re-rasterises it every frame against the rounded
 * clip, which made the hover jitter.
 */
function AlbumArt({ album }: { album: Album }) {
  const [failed, setFailed] = useState(false)

  if (!album.image || failed) {
    return (
      <span className="flex size-full flex-col justify-between p-3">
        <Disc3 className="size-4 shrink-0 text-fg-faint" strokeWidth={1.5} />
        <span className="min-w-0">
          <span className="line-clamp-2 text-[12px] font-medium leading-snug text-fg-secondary">
            {album.name}
          </span>
          <span className="mt-0.5 block truncate text-[10px] text-fg-muted">
            {album.artist}
          </span>
        </span>
      </span>
    )
  }

  return (
    <>
      <span className="absolute inset-0 overflow-hidden">
        <span className="zoom-layer absolute inset-0">
          <Image
            src={album.image}
            alt={`${album.name} by ${album.artist}`}
            fill
            sizes="(max-width: 640px) 50vw, 165px"
            unoptimized
            onError={() => setFailed(true)}
            className="object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
          />
        </span>
      </span>

      {/* title card slides up over the art on hover */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-bg via-bg/92 to-transparent p-2.5 pt-9 transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-y-0">
        <span className="line-clamp-2 text-[11px] font-medium leading-snug text-fg">
          {album.name}
        </span>
        <span className="mt-0.5 flex items-baseline justify-between gap-2">
          <span className="truncate text-[10px] text-fg-muted">
            {album.artist}
          </span>
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-fg-muted">
            {album.playcount}
          </span>
        </span>
      </span>
    </>
  )
}

/* ------------------------------------------------- tracks + artists rows */

type MediaItem = Track | Artist

/**
 * Shared row for tracks and artists.
 *
 * The artwork does double duty: sharp in the square tile, and stretched full
 * bleed + blurred across the row behind the text. That gives every row its own
 * colour without inventing a palette, and keeps the text legible because the
 * wash sits at low opacity under a fade-to-surface gradient.
 */
function MediaRows({
  items,
  kind,
}: {
  items: MediaItem[]
  kind: "track" | "artist"
}) {
  if (items.length === 0) {
    return (
      <Notice
        title={kind === "track" ? "no tracks yet" : "no artists yet"}
        body="scrobble something and this fills in within the hour."
      />
    )
  }

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={400}>
      <div className="space-y-1">
        {items.map((item, i) => (
          <MediaRow
            key={`${item.name}-${i}`}
            item={item}
            index={i}
            kind={kind}
          />
        ))}
      </div>
    </TooltipProvider>
  )
}

function MediaRow({
  item,
  index,
  kind,
}: {
  item: MediaItem
  index: number
  kind: "track" | "artist"
}) {
  const [failed, setFailed] = useState(false)
  const artist = "artist" in item ? item.artist : null
  const image = failed ? null : item.image

  const row = (
    <motion.a
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 14) * 0.04 }}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      // tighter than the album tiles so ten rows still clear the fold
      className="surface-raised surface-raised-hover press group relative isolate flex items-center gap-2.5 overflow-hidden rounded-(--radius-card) border border-line bg-surface p-1 pr-3.5 hover:border-line-hover"
    >
      {image ? (
        <>
          {/* full-bleed blurred wash */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-20 scale-110 opacity-40 blur-xl saturate-150 transition-opacity duration-500 group-hover:opacity-60"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* keeps the text side readable over the wash */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-surface via-surface/85 to-surface/40"
          />
        </>
      ) : null}

      <span className="w-6 shrink-0 text-center font-mono text-[11px] tabular-nums text-fg-faint">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        className={`relative size-8 shrink-0 overflow-hidden border border-line bg-surface-raised ${
          kind === "artist" ? "rounded-full" : "rounded-(--radius-tile)"
        }`}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="32px"
            unoptimized
            onError={() => setFailed(true)}
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center font-mono text-[13px] lowercase text-fg-muted">
            {item.name.charAt(0)}
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-fg">
          {item.name}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-fg-muted">
          {artist ?? `${item.playcount.toLocaleString()} plays`}
        </span>
      </span>

      <span className="shrink-0 font-mono text-[12px] tabular-nums text-fg-secondary">
        {item.playcount.toLocaleString()}
      </span>
    </motion.a>
  )

  // Names and artists truncate in a narrow column, so the tooltip carries the
  // untruncated version plus the exact scrobble count.
  return (
    <Tooltip>
      <TooltipTrigger asChild>{row}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-[280px] normal-case">
        <span className="block font-medium text-fg">{item.name}</span>
        {artist ? (
          <span className="mt-0.5 block text-fg-muted">{artist}</span>
        ) : null}
        <span className="mt-1 block font-mono text-[11px] text-fg-muted">
          {item.playcount.toLocaleString()} scrobbles this month
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

/* ------------------------------------------------------------------- stats */

function StatGrid({ stats }: { stats: Stats }) {
  const rows = [
    { label: "scrobbles, all time", value: stats.scrobbles },
    { label: "artists this month", value: stats.artists },
    { label: "albums this month", value: stats.albums },
    { label: "tracks this month", value: stats.tracks },
  ]

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {rows.map((row, i) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
        >
          <Card className="p-4">
            <div className="font-mono text-[22px] font-semibold tabular-nums text-fg">
              {row.value.toLocaleString()}
            </div>
            <div className="mt-1 text-[13px] text-fg-muted">{row.label}</div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- loading */

function Skeleton({ tab }: { tab: Tab }) {
  const count = tab === "Albums" ? 8 : 6

  return (
    <div
      className={
        tab === "Albums"
          ? "grid grid-cols-2 gap-2.5 sm:grid-cols-4"
          : "space-y-2"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-(--radius-card) border border-line bg-surface ${
            tab === "Albums" ? "aspect-square" : "h-[60px]"
          }`}
        />
      ))}
    </div>
  )
}

function Notice({ title, body }: { title: string; body?: string }) {
  return (
    <Card className="p-6 text-center">
      <p className="text-[14px] text-fg-secondary">{title}</p>
      {body ? (
        <p className="mx-auto mt-2 max-w-[44ch] text-[12px] leading-relaxed text-fg-muted">
          {body}
        </p>
      ) : null}
    </Card>
  )
}

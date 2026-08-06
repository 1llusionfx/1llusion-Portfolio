import "server-only"

import type { Album, Artist, MusicPayload, Track } from "./lastfm-types"

export type { Album, Artist, MusicPayload, Stats, Track } from "./lastfm-types"

/**
 * Last.fm client. Server-side only — the API key lives in LASTFM_API_KEY
 * (no NEXT_PUBLIC_ prefix) and never reaches the browser. The music page
 * talks to /api/lastfm instead of hitting Last.fm directly.
 */

const ENDPOINT = "https://ws.audioscrobbler.com/2.0/"
const PERIOD = "1month"
const LIMIT = 12

type LastfmImage = { size: string; "#text": string }

export function isConfigured() {
  return Boolean(process.env.LASTFM_API_KEY && process.env.LASTFM_USERNAME)
}

/**
 * Largest non-empty artwork, or null.
 *
 * Last.fm retired artist images years ago but still returns a URL for their
 * grey star placeholder, so that specific asset is treated as "no image" —
 * otherwise every artist tile would render the same grey star.
 */
const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f"

function pickImage(images?: LastfmImage[]): string | null {
  if (!images?.length) return null

  for (const size of ["extralarge", "large", "medium"]) {
    const hit = images.find((i) => i.size === size && i["#text"])
    if (hit && !hit["#text"].includes(PLACEHOLDER)) return hit["#text"]
  }

  const any = images.find(
    (i) => i["#text"] && !i["#text"].includes(PLACEHOLDER)
  )
  return any?.["#text"] ?? null
}

async function call(method: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({
    method,
    user: process.env.LASTFM_USERNAME!,
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
    ...extra,
  })

  const res = await fetch(`${ENDPOINT}?${params}`, {
    // Cache upstream for an hour so we never approach the rate limit,
    // regardless of how much traffic the page gets.
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`last.fm ${method} returned ${res.status}`)

  const json = await res.json()
  if (json.error) throw new Error(`last.fm ${method}: ${json.message}`)

  return json
}

/**
 * Deezer's search is free and keyless, and covers a good share of what
 * Last.fm has no artwork for. Used to fill album, track, and artist gaps.
 *
 * Runs only on cache misses (the whole payload is cached for an hour), and
 * failures are swallowed per-item so one bad lookup can't break the page.
 */
async function deezerImage(
  kind: "album" | "track" | "artist",
  query: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.deezer.com/search/${kind}?q=${encodeURIComponent(query)}&limit=1`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null

    const hit = (await res.json()).data?.[0]
    if (!hit) return null

    if (kind === "artist") return hit.picture_medium ?? null
    if (kind === "track") return hit.album?.cover_medium ?? null
    return hit.cover_medium ?? null
  } catch {
    return null
  }
}

/** Fills `image` on every entry that's missing one, in parallel. */
async function fillImages<T extends { image: string | null }>(
  items: T[],
  kind: "album" | "track" | "artist",
  toQuery: (item: T) => string
) {
  const gaps = items.filter((i) => !i.image)
  if (gaps.length === 0) return

  const found = await Promise.all(
    gaps.map((item) => deezerImage(kind, toQuery(item)))
  )
  gaps.forEach((item, i) => {
    if (found[i]) item.image = found[i]
  })
}

export async function getMusic(): Promise<MusicPayload> {
  const [albums, tracks, artists, info] = await Promise.all([
    call("user.gettopalbums", { period: PERIOD, limit: String(LIMIT) }),
    call("user.gettoptracks", { period: PERIOD, limit: String(LIMIT) }),
    call("user.gettopartists", { period: PERIOD, limit: String(LIMIT) }),
    call("user.getinfo"),
  ])

  const mappedAlbums: Album[] = (albums.topalbums?.album ?? []).map((a: any) => ({
    name: a.name,
    artist: a.artist?.name ?? "",
    image: pickImage(a.image),
    playcount: Number(a.playcount ?? 0),
    url: a.url,
  }))

  const mappedTracks: Track[] = (tracks.toptracks?.track ?? []).map((t: any) => ({
    name: t.name,
    artist: t.artist?.name ?? "",
    image: pickImage(t.image),
    playcount: Number(t.playcount ?? 0),
    url: t.url,
  }))

  const mappedArtists: Artist[] = (artists.topartists?.artist ?? []).map(
    (a: any) => ({
      name: a.name,
      image: pickImage(a.image),
      playcount: Number(a.playcount ?? 0),
      url: a.url,
    })
  )

  await Promise.all([
    fillImages(mappedAlbums, "album", (a) => `${a.artist} ${a.name}`),
    fillImages(mappedTracks, "track", (t) => `${t.artist} ${t.name}`),
    fillImages(mappedArtists, "artist", (a) => a.name),
  ])

  return {
    albums: mappedAlbums,
    tracks: mappedTracks,
    artists: mappedArtists,
    stats: {
      scrobbles: Number(info.user?.playcount ?? 0),
      artists: Number(artists.topartists?.["@attr"]?.total ?? 0),
      albums: Number(albums.topalbums?.["@attr"]?.total ?? 0),
      tracks: Number(tracks.toptracks?.["@attr"]?.total ?? 0),
    },
  }
}

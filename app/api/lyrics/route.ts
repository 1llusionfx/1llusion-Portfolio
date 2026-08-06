import { NextResponse } from "next/server"

/**
 * Synced-lyrics proxy for lrclib.net — free, keyless, community-maintained.
 *
 * Proxied rather than called from the browser so responses cache at the edge
 * (a track's lyrics never change) and the visitor's browser never talks to a
 * third party. lrclib asks for a descriptive User-Agent, so we send one.
 *
 * Returns lines already parsed out of LRC format:
 *   [{ time: 4.32, text: "..." }, …]
 */

export const revalidate = 86400

type Line = { time: number; text: string }

/** "[00:04.32] text" -> { time: 4.32, text } */
function parseLrc(lrc: string): Line[] {
  const lines: Line[] = []

  for (const raw of lrc.split("\n")) {
    const match = raw.match(/^\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]\s*(.*)$/)
    if (!match) continue

    const [, mm, ss, frac, text] = match
    const time =
      Number(mm) * 60 + Number(ss) + (frac ? Number(frac) / 10 ** frac.length : 0)

    lines.push({ time, text: text.trim() })
  }

  return lines.sort((a, b) => a.time - b.time)
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const artist = params.get("artist")?.trim()
  const track = params.get("track")?.trim()
  const duration = params.get("duration")

  if (!artist || !track) {
    return NextResponse.json({ error: "artist and track are required" }, { status: 400 })
  }

  const query = new URLSearchParams({
    artist_name: artist,
    track_name: track,
    ...(duration ? { duration } : {}),
  })

  try {
    const res = await fetch(`https://lrclib.net/api/get?${query}`, {
      headers: {
        "User-Agent": "1llusion-portfolio (https://1llusion.dev)",
      },
      next: { revalidate: 86400 },
    })

    // 404 just means nobody has transcribed this track — not an error.
    if (res.status === 404) {
      return NextResponse.json(
        { lines: [], synced: false },
        { headers: { "Cache-Control": "public, s-maxage=3600" } }
      )
    }
    if (!res.ok) throw new Error(`lrclib returned ${res.status}`)

    const json = await res.json()
    const lines = json.syncedLyrics ? parseLrc(json.syncedLyrics) : []

    return NextResponse.json(
      { lines, synced: lines.length > 0, instrumental: Boolean(json.instrumental) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error"
    return NextResponse.json({ error: message, lines: [] }, { status: 502 })
  }
}

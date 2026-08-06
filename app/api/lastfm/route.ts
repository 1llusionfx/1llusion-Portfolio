import { NextResponse } from "next/server"

import { getMusic, isConfigured } from "@/lib/lastfm"

export const revalidate = 3600

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "last.fm is not configured — set LASTFM_API_KEY and LASTFM_USERNAME" },
      { status: 503 }
    )
  }

  try {
    const data = await getMusic()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

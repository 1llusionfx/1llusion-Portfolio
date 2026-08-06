import { NextResponse } from "next/server"

import { biolinks } from "@/content/biolinks"

/**
 * Favicon proxy.
 *
 * DuckDuckGo answers unknown domains with HTTP 404 but still sends a valid
 * generic-globe PNG. Browsers decode that body and fire `load`, not `error`,
 * so a client-side onError fallback can never trigger — the placeholder just
 * silently replaces the real mark.
 *
 * Proxying it server-side lets us read the actual status and return a real
 * 404 with no body, so the client falls back properly. It also keeps the
 * visitor's browser from talking to a third party at all.
 *
 * The domain is checked against the biolinks list before we fetch anything —
 * without that this route would be an open proxy (SSRF).
 */

const allowed = new Set(
  biolinks.map((link) => new URL(link.href).hostname.toLowerCase())
)

export const revalidate = 86400

export async function GET(request: Request) {
  const domain = new URL(request.url).searchParams.get("domain")?.toLowerCase()

  if (!domain || !allowed.has(domain)) {
    return new NextResponse(null, { status: 400 })
  }

  try {
    const upstream = await fetch(
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      { next: { revalidate: 86400 } }
    )

    // The status is the whole point — a 404 body here is the generic globe.
    if (!upstream.ok) return new NextResponse(null, { status: 404 })

    const body = await upstream.arrayBuffer()
    if (body.byteLength === 0) return new NextResponse(null, { status: 404 })

    return new NextResponse(body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/x-icon",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}

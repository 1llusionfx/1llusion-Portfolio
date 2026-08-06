import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

/**
 * View counter, backed by Upstash Redis.
 *
 * Vercel injects KV_REST_API_URL and KV_REST_API_TOKEN automatically when you
 * add Upstash from the Storage tab, so no wiring is needed beyond creating the
 * database. If those vars are absent (a fresh clone, or local dev without a
 * database) the route falls back to the public counterapi.dev service so the
 * pill still works rather than silently disappearing.
 *
 * Runs server-side either way, so no third-party endpoint is exposed to
 * visitors and the backing store can change without touching the client.
 */

export const dynamic = "force-dynamic"

const KEY = "portfolio:views"
const FALLBACK = "https://api.counterapi.dev/v1/1llusion-dev/site-views/up"

const hasUpstash = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

// Constructed once per lambda instance, not per request.
const redis = hasUpstash
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null

async function incrementViaCounterApi() {
  const res = await fetch(FALLBACK, { cache: "no-store" })
  if (!res.ok) throw new Error(`counterapi returned ${res.status}`)

  const json = await res.json()
  return Number(json.count)
}

export async function POST() {
  try {
    const views = redis ? await redis.incr(KEY) : await incrementViaCounterApi()

    if (!Number.isFinite(views)) throw new Error("counter returned a non-number")

    return NextResponse.json({ views, source: redis ? "upstash" : "fallback" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

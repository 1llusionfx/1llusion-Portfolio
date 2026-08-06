"use client"

import { useEffect, useState } from "react"

import { site } from "@/content/site"

const format = (date: Date, timeZone?: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...(timeZone ? { timeZone } : {}),
  }).format(date)

/**
 * "i'll get back to you. your 18:46 is my 19:46"
 *
 * Renders nothing until mounted — the visitor's clock isn't knowable during
 * static prerender, and guessing would cause a hydration mismatch.
 */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const theirs = format(now)
  const mine = format(now, site.timezone)

  if (theirs === mine) {
    return (
      <p className="text-[13px] text-fg-muted">
        i&apos;ll get back to you. it&apos;s <Chip>{mine}</Chip> where i am — same
        as you.
      </p>
    )
  }

  return (
    <p className="text-[13px] text-fg-muted">
      i&apos;ll get back to you. your <Chip>{theirs}</Chip> is my{" "}
      <Chip>{mine}</Chip>
    </p>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 rounded border border-line bg-surface-raised px-1.5 py-0.5 font-mono text-[12px] text-fg-secondary">
      {children}
    </span>
  )
}

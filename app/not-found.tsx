import Link from "next/link"

import { Eyebrow } from "@/components/ui/Eyebrow"

/**
 * Without this, Next serves its built-in not-found page, which ships its own
 * light-theme inline styles and renders as a white flash inside a dark site.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-5 pb-28 pt-16 sm:px-[88px] sm:pb-16">
      <div className="w-full max-w-[680px] space-y-3">
        <Eyebrow>404</Eyebrow>

        <h1 className="text-[34px] font-bold lowercase leading-none tracking-tight text-fg">
          nothing <span className="font-serif font-normal italic">here</span>
        </h1>

        <p className="max-w-[46ch] pt-1 text-[15px] leading-relaxed text-fg-secondary">
          that page doesn&apos;t exist — wrong link, or something moved.
        </p>

        <div className="pt-3">
          <Link
            href="/"
            className="press surface-raised surface-raised-hover inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] text-fg-secondary hover:border-line-hover hover:bg-surface-hover hover:text-fg"
          >
            <span aria-hidden>←</span> back home
          </Link>
        </div>
      </div>
    </main>
  )
}

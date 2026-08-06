import Link from "next/link"

import { cn } from "@/lib/utils"
import { Eyebrow } from "./Eyebrow"

/**
 * Section divider. Optionally carries a right-aligned action link,
 * e.g. `— recent work            see more →`
 */
export function SectionLabel({
  children,
  action,
  className,
}: {
  children: React.ReactNode
  action?: { label: string; href: string }
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <Eyebrow>{children}</Eyebrow>
      {action ? (
        <Link
          href={action.href}
          className="shrink-0 text-xs text-fg-muted transition-colors duration-200 hover:text-fg"
        >
          {action.label} <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  )
}

"use client"

import { Bug, Crown, Lightbulb, type LucideIcon } from "lucide-react"

import type { Badge } from "@/content/projects"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Discord-style role markers. The icon alone doesn't say what the role was,
 * so each carries a tooltip — that's the difference between decoration and
 * information.
 */
const badges: Record<Badge, { icon: LucideIcon; label: string }> = {
  owner: { icon: Crown, label: "owner" },
  innovator: { icon: Lightbulb, label: "innovator" },
  bughunter: { icon: Bug, label: "bug hunter" },
}

export function ProjectBadges({ badges: list }: { badges?: Badge[] }) {
  if (!list?.length) return null

  return (
    <span className="flex shrink-0 items-center gap-1">
      {list.map((key) => {
        const { icon: Icon, label } = badges[key]
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <span
                aria-label={label}
                className="flex size-[18px] items-center justify-center rounded-[5px] border border-line bg-surface-raised text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                <Icon className="size-2.5" strokeWidth={2} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">{label}</TooltipContent>
          </Tooltip>
        )
      })}
    </span>
  )
}

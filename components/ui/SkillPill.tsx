"use client"

import { BrandIcon } from "./BrandIcon"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/**
 * Tech pill. Glyphs come from simple-icons and inherit currentColor, so they
 * stay legible on any surface — brand sets with baked-in fills produce
 * black-on-black marks here.
 *
 * A logo wall says nothing on its own; the tooltip carries the meaning.
 */
export function SkillPill({
  name,
  icon,
  note,
}: {
  name: string
  icon: string
  note?: string
}) {
  const pill = (
    <span className="press surface-raised surface-raised-hover group inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-2.5 pr-3.5 text-[13px] text-fg-secondary hover:border-line-hover hover:bg-surface-hover hover:text-fg">
      <span className="flex shrink-0 items-center text-fg-muted transition-colors duration-200 group-hover:text-fg">
        <BrandIcon name={icon} />
      </span>
      {name}
    </span>
  )

  if (!note) return pill

  return (
    <Tooltip>
      <TooltipTrigger asChild>{pill}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px] normal-case">
        {note}
      </TooltipContent>
    </Tooltip>
  )
}

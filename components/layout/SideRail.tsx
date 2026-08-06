"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  Braces,
  Briefcase,
  House,
  Link2,
  Mail,
  Monitor,
  Music,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  /**
   * Optical size correction. Lucide draws to a shared 24px grid, but the
   * glyphs don't fill it equally: Braces is tall and narrow, Music sits low
   * and light, Monitor is a wide squat rectangle. At one nominal size they
   * read as different weights. These nudge each toward the same visual mass.
   */
  scale?: number
}

const nav: NavItem[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/music", label: "Music", icon: Music, scale: 1.04 },
  { href: "/projects", label: "Projects", icon: Briefcase, scale: 0.98 },
  { href: "/skills", label: "Skills", icon: Braces, scale: 1.12 },
  { href: "/setup", label: "Setup", icon: Monitor, scale: 1.02 },
  { href: "/biolinks", label: "Biolinks", icon: Link2, scale: 1.06 },
  { href: "/contact", label: "Contact", icon: Mail, scale: 1.02 },
]

/**
 * Fixed navigation. A vertical rail pinned to the left edge on desktop,
 * a horizontal bar pinned to the bottom on small screens.
 *
 * The active state is a single shared element (`layoutId`), so switching
 * routes slides the highlight between icons instead of cutting to it.
 */
export function SideRail() {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={300}>
      <nav
        aria-label="Primary"
        className={cn(
          "surface-floating fixed z-50 flex gap-1 rounded-xl border border-line bg-surface/85 p-1.5 backdrop-blur-xl",
          "bottom-4 left-1/2 -translate-x-1/2 flex-row",
          "sm:bottom-auto sm:left-6 sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:flex-col"
        )}
      >
        {nav.map(({ href, label, icon: Icon, scale = 1 }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href)

          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-(--radius-tile) transition-colors duration-200",
                    active ? "text-bg" : "text-fg-muted hover:text-fg"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="rail-active"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                        mass: 0.7,
                      }}
                      className="absolute inset-0 rounded-(--radius-tile) bg-fg shadow-[0_2px_8px_-2px_rgba(255,255,255,0.25)]"
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-(--radius-tile) bg-transparent transition-colors duration-200 hover:bg-surface-hover" />
                  )}

                  <Icon
                    className="relative z-10 size-[17px] transition-transform duration-200"
                    strokeWidth={active ? 2.1 : 1.75}
                    style={scale === 1 ? undefined : { scale: String(scale) }}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden sm:block">
                {label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </TooltipProvider>
  )
}

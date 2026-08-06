import {
  Box,
  Code2,
  Globe,
  Headphones,
  Keyboard,
  Monitor,
  Mouse,
  Package,
  Terminal,
  type LucideIcon,
} from "lucide-react"

import { BrandIcon, hasBrandIcon } from "./BrandIcon"

/**
 * Resolves the icon strings used in content/*.ts. Brand marks take priority
 * over the generic lucide glyphs, so `razer` renders the logo while `mouse`
 * renders the outline. Unknown names fall back to a box.
 */
const registry: Record<string, LucideIcon> = {
  monitor: Monitor,
  mouse: Mouse,
  keyboard: Keyboard,
  headphones: Headphones,
  code: Code2,
  globe: Globe,
  terminal: Terminal,
  package: Package,
}

export function DynamicIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  if (hasBrandIcon(name)) return <BrandIcon name={name} className={className} />

  const Icon = registry[name] ?? Box
  return <Icon className={className} strokeWidth={1.5} />
}

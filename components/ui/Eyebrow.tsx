import { cn } from "@/lib/utils"

/**
 * The `— label` marker that opens every page and section.
 * The dash is a decorative rule, not a character, so it scales cleanly.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-mono text-xs lowercase text-fg-muted",
        className
      )}
    >
      <span aria-hidden className="h-px w-4 shrink-0 bg-fg-faint" />
      {children}
    </div>
  )
}

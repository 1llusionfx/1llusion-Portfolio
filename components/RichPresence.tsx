"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AppWindow, Music2 } from "lucide-react"

import type { Activity } from "@/components/DiscordStatus"
import { easeOutExpo } from "@/lib/motion"
import { AppIcon, FileIcon, hasAppIcon, hasFileIcon } from "@/components/ui/AppIcon"

/**
 * Discord rich presence, two lines:
 *
 *   [app icon]   Visual Studio Code        · workspace
 *   [file icon]  Editing ViewCounter.tsx
 *
 * The second icon is derived from whatever the activity is actually about —
 * the file's language for an editor, a note for anything being listened to.
 */

/** Pulls "ViewCounter.tsx" out of "Editing ViewCounter.tsx". */
function extractFilename(details: string | null) {
  if (!details) return null
  const match = details.match(/([\w.\-]+\.[a-z0-9]{1,6})(?:\s|$)/i)
  return match?.[1] ?? null
}

export function RichPresence({ activity }: { activity: Activity | null }) {
  return (
    <AnimatePresence mode="wait">
      {activity ? (
        <motion.div
          key={activity.name + activity.details}
          // Text replaced in place — blur on the crossover keeps the outgoing
          // and incoming lines from reading as one smeared string.
          initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="flex flex-col gap-1.5"
        >
          <Row
            icon={
              hasAppIcon(activity.name) ? (
                <AppIcon name={activity.name} className="block size-full" />
              ) : (
                <AppWindow className="size-3.5 text-fg-muted" strokeWidth={1.8} />
              )
            }
            primary={activity.name}
            secondary={activity.type === 2 ? null : activity.state}
            emphasis
          />

          {activity.details ? (
            <Row
              icon={<DetailIcon activity={activity} />}
              primary={activity.details}
              secondary={activity.type === 2 ? activity.state : null}
            />
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function DetailIcon({ activity }: { activity: Activity }) {
  const filename = extractFilename(activity.details)

  if (filename && hasFileIcon(filename)) {
    return <FileIcon filename={filename} className="block size-full" />
  }
  if (activity.type === 2) {
    return <Music2 className="size-3.5 text-fg-muted" strokeWidth={1.8} />
  }
  return <span className="block size-1 rounded-full bg-fg-faint" />
}

function Row({
  icon,
  primary,
  secondary,
  emphasis = false,
}: {
  icon: React.ReactNode
  primary: string
  secondary?: string | null
  emphasis?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex size-[15px] shrink-0 items-center justify-center [&>span>svg]:size-full [&>span]:block [&>span]:size-full">
        {icon}
      </span>

      <span
        className={`truncate text-[12px] ${
          emphasis ? "font-medium text-fg-secondary" : "text-fg-muted"
        }`}
      >
        {primary}
      </span>

      {secondary ? (
        <span className="hidden shrink-0 truncate text-[11px] text-fg-faint sm:inline">
          <span aria-hidden className="mr-1.5">
            ·
          </span>
          {secondary}
        </span>
      ) : null}
    </div>
  )
}

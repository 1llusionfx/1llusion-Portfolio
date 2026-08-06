"use client"

import { AnimatePresence, motion } from "framer-motion"

import { useDiscordPresence } from "@/components/DiscordStatus"

/**
 * Album art washed across the whole page while something is playing.
 *
 * Lives in the root layout so it persists across routes, and reads from the
 * shared presence store rather than its own poll.
 *
 * Kept deliberately faint: the site is monochrome, and a full-strength cover
 * would tint every surface and wreck text contrast. At this opacity it reads
 * as the room having a colour rather than the page having a photo in it.
 * Cross-fades over 1.2s so a track change is a drift, not a cut.
 */
export function SpotifyBackdrop() {
  const { spotify } = useDiscordPresence()

  return (
    <AnimatePresence mode="sync">
      {spotify ? (
        <motion.div
          key={spotify.album_art_url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
        >
          {/* scaled past the viewport so the blur has no visible edges */}
          <span
            className="absolute -inset-[15%] block opacity-[0.22] blur-[90px] saturate-150"
            style={{
              backgroundImage: `url(${spotify.album_art_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* pulls the centre back down so body text keeps its contrast */}
          <span className="absolute inset-0 block bg-gradient-to-b from-bg/70 via-bg/55 to-bg/80" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

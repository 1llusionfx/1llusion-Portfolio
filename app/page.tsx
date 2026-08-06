"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import { commissions } from "@/content/commissions"
import { discordUrl, experience, githubUrl, site } from "@/content/site"
import { itemVariants } from "@/lib/motion"
import { PageShell } from "@/components/layout/PageShell"
import { CommissionsModal } from "@/components/CommissionsModal"
import { RichPresence } from "@/components/RichPresence"
import { SpotifyLyrics } from "@/components/SpotifyLyrics"
import { useLyrics } from "@/components/spotify/useLyrics"
import { SpotifyWidget } from "@/components/SpotifyWidget"
import {
  DiscordAvatar,
  StatusDot,
  useDiscordPresence,
} from "@/components/DiscordStatus"
import { BrandIcon } from "@/components/ui/BrandIcon"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { Highlight } from "@/components/ui/Highlight"
import { Pill } from "@/components/ui/Pill"

export default function HomePage() {
  const [commissionsOpen, setCommissionsOpen] = useState(false)
  const { status, activity, spotify, avatarUrl, ready } = useDiscordPresence()

  // Fetched here, not inside SpotifyLyrics: the layout below needs to know
  // whether lyrics exist before deciding to allocate a column for them.
  const lyrics = useLyrics(spotify)
  const hasLyrics = Boolean(spotify) && lyrics.length > 0

  return (
    <PageShell className="space-y-6">
      <motion.header variants={itemVariants} className="space-y-3">
        <Eyebrow>{site.eyebrow}</Eyebrow>

        <h1 className="text-[34px] font-bold lowercase leading-none tracking-tight text-fg">
          {site.name}
        </h1>

        <div className="flex items-center gap-2">
          <span className="relative size-[22px] shrink-0">
            <DiscordAvatar url={avatarUrl} ready={ready} sizes="22px" />
            <StatusDot
              status={status}
              className="absolute -bottom-px -right-px size-2.5 rounded-full ring-2 ring-bg"
            />
          </span>
          <span className="font-mono text-[13px] text-fg-muted">
            {site.handle}
          </span>
        </div>
      </motion.header>

      <motion.div
        variants={itemVariants}
        className="surface-raised rounded-(--radius-card) border border-line bg-surface p-5"
      >
        <p className="text-[15px] leading-relaxed text-fg-secondary">
          <Highlight text={site.bio.text} terms={site.bio.bold} />
        </p>
      </motion.div>

      {/* Sits directly under the bio, in the normal reading flow. */}
      <motion.div variants={itemVariants}>
        <SpotifyWidget spotify={spotify} />
      </motion.div>

      {/* Links and presence on the left, live lyrics filling the space beside
          them. The lyrics panel is absent when nothing is playing, and the
          left column simply takes the full width. */}
      <div
        className={
          hasLyrics
            // 1.25/0.75 keeps the longest experience line and its year on one
            // row; an evener split wraps it.
            ? "grid items-start gap-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]"
            : ""
        }
      >
        <div className="space-y-5">
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            <Pill href={discordUrl} icon={<BrandIcon name="discord" />}>
              Discord
            </Pill>
            <Pill href={githubUrl} icon={<BrandIcon name="github" />}>
              GitHub
            </Pill>
            {/* No price here — with it the row wrapped onto a second line.
                The rate is on the modal this opens, and on /projects. */}
            <Pill
              onClick={() => setCommissionsOpen(true)}
              icon={<Sparkles strokeWidth={1.8} />}
            >
              commissions
            </Pill>
          </motion.div>

          {/* No `variants` wrapper: this mounts only once Lanyard answers, by
              which point the parent's stagger has finished. A late-mounting
              child inherits `initial="hidden"` but never receives "visible",
              so it would stay at opacity 0. It animates itself instead. */}
          <RichPresence activity={activity} />

          {/* Inside the left column, not below the grid — as a grid sibling it
              would sit under whichever column is taller, leaving dead space. */}
          <motion.section variants={itemVariants} className="space-y-3 pt-1">
            <Eyebrow>experience</Eyebrow>
            <ul className="space-y-2.5">
              {experience.map((entry) => (
                <li
                  key={entry.title}
                  className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5"
                >
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      // `-my-2 py-2` enlarges the touch target without adding
                      // height: the flex parent blockifies this anchor, so
                      // padding alone would make linked rows taller than plain
                      // ones. The negative margin cancels the layout cost.
                      className="-my-2 py-2 text-[14px] text-fg-secondary underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-fg hover:decoration-fg-muted"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <span className="text-[14px] text-fg-secondary">
                      {entry.title}
                    </span>
                  )}
                  <span className="font-mono text-[12px] text-fg-muted">
                    {entry.meta}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        <SpotifyLyrics spotify={spotify} lines={lyrics} />
      </div>

      <CommissionsModal
        open={commissionsOpen}
        onClose={() => setCommissionsOpen(false)}
      />
    </PageShell>
  )
}

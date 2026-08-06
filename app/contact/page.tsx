"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

import { discordUrl, githubUrl, site } from "@/content/site"
import { itemVariants } from "@/lib/motion"
import { PageShell } from "@/components/layout/PageShell"
import { CopyButton } from "@/components/CopyButton"
import { LocalTime } from "@/components/LocalTime"
import {
  DiscordAvatar,
  StatusDot,
  useDiscordPresence,
} from "@/components/DiscordStatus"
import { BrandIcon } from "@/components/ui/BrandIcon"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/ui/PageHeader"

export default function ContactPage() {
  const { status, avatarUrl, ready } = useDiscordPresence()

  return (
    <PageShell>
      <PageHeader
        eyebrow="get in touch"
        title="contact"
        description="open for collabs, questions, or just a hello — discord is the only way i actually reply."
      />

      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <div className="flex items-center gap-3.5">
            <span className="relative size-11 shrink-0">
              <DiscordAvatar url={avatarUrl} ready={ready} sizes="44px" />
              <StatusDot
                status={status}
                className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full ring-[3px] ring-surface"
              />
            </span>

            <div className="min-w-0">
              <div className="truncate text-[16px] font-medium text-fg">
                <span className="text-fg-muted">@</span>
                {site.discordHandle}
              </div>
              <p className="mt-0.5 text-[13px] text-fg-muted">
                fastest way to reach me :)
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={site.discordHandle} label="copy handle" />
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="press surface-raised surface-raised-hover inline-flex items-center gap-2 rounded-(--radius-tile) border border-line bg-surface py-1.5 pl-2.5 pr-3.5 text-[13px] text-fg-secondary hover:border-line-hover hover:bg-surface-hover hover:text-fg"
            >
              <ExternalLink aria-hidden className="size-3.5" strokeWidth={1.8} />
              open
            </a>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="flex items-center gap-3 p-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-tile) border border-line bg-surface-raised text-fg-secondary">
            <BrandIcon name="github" className="size-4" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-medium text-fg">
              <span className="text-fg-muted">@</span>
              {site.githubUser}
            </div>
            <p className="mt-0.5 truncate text-[12px] text-fg-muted">
              repos &amp; builds
            </p>
          </div>

          <div className="flex shrink-0 gap-1.5">
            <CopyButton value={site.githubUser} iconOnly label="copy" />
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`open ${site.githubUser} on github`}
              className="press surface-raised surface-raised-hover flex size-8 items-center justify-center rounded-(--radius-tile) border border-line bg-surface text-fg-secondary hover:border-line-hover hover:bg-surface-hover hover:text-fg"
            >
              <ExternalLink aria-hidden className="size-3.5" strokeWidth={1.8} />
            </a>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <LocalTime />
      </motion.div>
    </PageShell>
  )
}

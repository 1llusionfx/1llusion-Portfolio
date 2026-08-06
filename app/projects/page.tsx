"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import { commissions } from "@/content/commissions"
import { featured, past } from "@/content/projects"
import { itemVariants } from "@/lib/motion"
import { PageShell } from "@/components/layout/PageShell"
import { CommissionsModal } from "@/components/CommissionsModal"
import { FeaturedCard } from "@/components/ui/FeaturedCard"
import { PageHeader } from "@/components/ui/PageHeader"
import { ProjectCard } from "@/components/ui/ProjectCard"
import { SectionLabel } from "@/components/ui/SectionLabel"

export default function ProjectsPage() {
  const [commissionsOpen, setCommissionsOpen] = useState(false)

  return (
    <PageShell width="wide" className="space-y-6">
      <motion.button
        variants={itemVariants}
        type="button"
        onClick={() => setCommissionsOpen(true)}
        className="press surface-raised surface-raised-hover group flex w-full items-center justify-between gap-4 rounded-(--radius-card) border border-line bg-surface px-4 py-3 text-left hover:border-line-hover hover:bg-surface-hover"
      >
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-fg-secondary">
          <Sparkles
            aria-hidden
            className="size-3.5 shrink-0 text-fg-muted transition-colors duration-200 group-hover:text-fg"
            strokeWidth={1.8}
          />
          taking commissions
          <span className="text-fg-muted">
            <span aria-hidden className="mr-2">
              ·
            </span>
            from {commissions.startingAt.replace("+", "")}
          </span>
        </span>
        <span className="shrink-0 text-[13px] text-fg-muted transition-colors duration-200 group-hover:text-fg">
          inquire <span aria-hidden>→</span>
        </span>
      </motion.button>

      <PageHeader
        eyebrow="my work"
        title="projects"
        description="commissions, collaborations, and personal builds."
      />

      {/* Featured left, the rest stacked right — keeps the whole page inside
          one viewport instead of running the cards down a single column. */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 lg:grid-cols-5 lg:gap-5"
      >
        <div className="lg:col-span-3">
          <FeaturedCard {...featured} compact />
        </div>

        <div className="space-y-3 lg:col-span-2">
          <SectionLabel>past collabs</SectionLabel>
          <div className="space-y-2.5">
            {past.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </motion.div>

      <CommissionsModal
        open={commissionsOpen}
        onClose={() => setCommissionsOpen(false)}
      />
    </PageShell>
  )
}

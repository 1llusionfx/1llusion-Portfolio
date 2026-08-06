"use client"

import { motion } from "framer-motion"

import {
  dock,
  hardware,
  setupIntro,
  shell,
  tools,
  workstation,
  type SetupItem,
  type TagItem,
} from "@/content/setup"
import { itemVariants } from "@/lib/motion"
import { PageShell } from "@/components/layout/PageShell"
import { DynamicIcon } from "@/components/ui/DynamicIcon"
import { IconTileCard } from "@/components/ui/IconTileCard"
import { PageHeader } from "@/components/ui/PageHeader"
import { Pill } from "@/components/ui/Pill"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function SetupPage() {
  return (
    <PageShell className="space-y-6">
      <PageHeader eyebrow="what i use" title="setup" description={setupIntro} />

      {/* One provider for the page so hovering between cards reuses the open
          delay rather than re-waiting on each. */}
      <TooltipProvider delayDuration={250} skipDelayDuration={500}>
        <CardSection label="hardware" items={hardware} />
        <CardSection label="workstation" items={workstation} />

        {/* The three tag lists are short, so pairing them into columns keeps
            the page on one screen instead of three near-empty rows. */}
        <div className="grid gap-6 sm:grid-cols-2">
          <TagSection label="in my dock" items={dock} />
          <TagSection label="tools i reach for" items={tools} />
        </div>

        <TagSection label="shell" items={shell} />
      </TooltipProvider>
    </PageShell>
  )
}

function CardSection({ label, items }: { label: string; items: SetupItem[] }) {
  return (
    <motion.section variants={itemVariants} className="space-y-2.5">
      <SectionLabel>{label}</SectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <IconTileCard key={item.name} {...item} />
        ))}
      </div>
    </motion.section>
  )
}

function TagSection({ label, items }: { label: string; items: TagItem[] }) {
  return (
    <motion.section variants={itemVariants} className="space-y-2.5">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Pill
            key={item.name}
            href={item.href}
            note={item.note}
            icon={item.icon ? <DynamicIcon name={item.icon} /> : undefined}
          >
            {item.name}
          </Pill>
        ))}
      </div>
    </motion.section>
  )
}

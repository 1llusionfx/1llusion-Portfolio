"use client"

import { motion } from "framer-motion"

import { skillGroups, skillsIntro } from "@/content/skills"
import { itemVariants } from "@/lib/motion"
import { PageShell } from "@/components/layout/PageShell"
import { PageHeader } from "@/components/ui/PageHeader"
import { SkillPill } from "@/components/ui/SkillPill"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function SkillsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="my tech stack"
        title="skills"
        description={skillsIntro}
      />

      {/* One provider for the whole page so moving between pills reuses the
          open delay instead of re-waiting on each. */}
      <TooltipProvider delayDuration={250} skipDelayDuration={500}>
        <div className="space-y-7">
          {skillGroups.map((group) => (
          <motion.section
            key={group.title}
            variants={itemVariants}
            className="space-y-3"
          >
            <h2 className="text-[15px] text-fg-secondary">{group.title}</h2>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <SkillPill
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  note={item.note}
                />
              ))}
            </div>
            </motion.section>
          ))}
        </div>
      </TooltipProvider>
    </PageShell>
  )
}

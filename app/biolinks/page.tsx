"use client"

import Link from "next/link"
import { motion } from "framer-motion"

import { biolinks, biolinksIntro } from "@/content/biolinks"
import { itemVariants } from "@/lib/motion"
import { PageShell } from "@/components/layout/PageShell"
import { BiolinkRow } from "@/components/ui/BiolinkRow"
import { PageHeader } from "@/components/ui/PageHeader"

export default function BiolinksPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="link-in-bio"
        title="biolinks"
        description={biolinksIntro}
      />

      <motion.div variants={itemVariants} className="space-y-2.5">
        {biolinks.map((link) => (
          <BiolinkRow key={link.href} link={link} />
        ))}
      </motion.div>

      <motion.p variants={itemVariants} className="text-[13px] text-fg-muted">
        <Link
          href="/contact"
          className="py-2 text-fg-secondary underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-fg hover:decoration-fg-muted"
        >
          contact
        </Link>{" "}
        me if you want yours here :)
      </motion.p>
    </PageShell>
  )
}

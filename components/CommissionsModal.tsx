"use client"

import { commissions } from "@/content/commissions"
import { featured } from "@/content/projects"
import { skillGroups } from "@/content/skills"
import { discordUrl } from "@/content/site"
import { BrandIcon } from "@/components/ui/BrandIcon"
import { Accordion } from "@/components/ui/Accordion"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { FeaturedCard } from "@/components/ui/FeaturedCard"
import { Modal } from "@/components/ui/Modal"
import { SerifAccent } from "@/components/ui/SerifAccent"
import { SkillPill } from "@/components/ui/SkillPill"

/** Flattened, deduped stack shown as pills inside the modal. */
const stack = skillGroups.flatMap((group) => group.items).slice(0, 10)

export function CommissionsModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} label="commissions">
      <div className="space-y-7">
        <header className="space-y-3">
          <Eyebrow>{commissions.eyebrow}</Eyebrow>
          <h2 className="text-[30px] font-bold lowercase leading-none tracking-tight text-fg">
            <SerifAccent
              text={commissions.title}
              accent={commissions.titleAccent}
            />
          </h2>
          <p className="text-[14px] text-fg-secondary">{commissions.tagline}</p>
        </header>

        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[15px] font-semibold text-fg">
            {commissions.stat.value}
          </span>
          <span className="text-[13px] text-fg-muted">
            {commissions.stat.label}
          </span>
        </div>

        <Section label="what i build" body={commissions.whatIBuild} />

        <section className="space-y-3">
          <Eyebrow>stack</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <SkillPill key={item.name} name={item.name} icon={item.icon} />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <Eyebrow>recent work</Eyebrow>
          <FeaturedCard {...featured} />
        </section>

        <Section label="how it works" body={commissions.howItWorks} />
        <Section label="rates" body={commissions.rates} />
        <Section label="what i pass on" body={commissions.whatIPassOn} />

        <section className="space-y-3">
          <Eyebrow>faq</Eyebrow>
          <Accordion items={commissions.faq} />
        </section>

        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="press surface-raised surface-raised-hover flex items-center justify-center gap-2 rounded-(--radius-card) border border-line bg-surface-raised py-3 text-[13px] text-fg-secondary hover:border-line-hover hover:text-fg"
        >
          <BrandIcon name="discord" />
          message me on discord
        </a>
      </div>
    </Modal>
  )
}

function Section({ label, body }: { label: string; body: string }) {
  return (
    <section className="space-y-3">
      <Eyebrow>{label}</Eyebrow>
      <p className="text-[14px] leading-relaxed text-fg-secondary">{body}</p>
    </section>
  )
}

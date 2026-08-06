"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import type { PastProject } from "@/content/projects"
import { Card } from "./Card"
import { ProjectBadges } from "./ProjectBadge"

/**
 * Card for the right-hand column of /projects.
 *
 * The logo tile is sized to actually hold a mark rather than a single letter,
 * and stays reserved even before the file exists so adding one later doesn't
 * reflow the layout.
 */
export function ProjectCard({ project }: { project: PastProject }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = project.logo && !logoFailed

  return (
    <Card
      as="a"
      interactive
      className="press group block"
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-start gap-3.5 p-4">
        <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-(--radius-tile) border border-line bg-surface-raised">
          {showLogo ? (
            <Image
              src={project.logo!}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="font-serif text-lg lowercase italic text-fg-faint">
              {project.name.charAt(0)}
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15px] font-medium text-fg">
              {project.name}
            </span>
            <ProjectBadges badges={project.badges} />
            <span className="font-mono text-[11px] text-fg-muted">
              {project.year}
            </span>
          </span>

          <span className="mt-1.5 block text-[13px] leading-relaxed text-fg-secondary">
            {project.description}
          </span>
        </span>

        <ArrowUpRight
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-fg-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg-muted"
          strokeWidth={1.8}
        />
      </div>
    </Card>
  )
}

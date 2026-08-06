/**
 * Global identity + everything that appears on more than one page.
 */

export const site = {
  name: "illusion",
  handle: "@1llusionfx",
  avatar: "/pfp.jpg",

  eyebrow: "hey there",

  /**
   * Home bio. `bold` segments are rendered with emphasis inline, so keep them
   * as exact substrings of `text`.
   */
  bio: {
    text: "i'm a junior fullstack developer building web apps with modern tooling. stronger on backend logic, currently exploring and improving my frontend. check out my projects or find me on discord.",
    bold: ["junior fullstack developer"],
  },

  description:
    "illusion — junior fullstack developer. python, typescript, and full-stack projects.",

  discordId: "470286224888954900",
  discordHandle: "1llusion",
  githubUser: "1llusionfx",

  /** IANA timezone, used by the contact page clock. */
  timezone: "Europe/Berlin",
} as const

export const discordUrl = `https://discord.com/users/${site.discordId}`
export const githubUrl = `https://github.com/${site.githubUser}`

/**
 * Experience timeline, shown on the home page.
 */
export type ExperienceEntry = {
  title: string
  meta: string
  href?: string
}

export const experience: ExperienceEntry[] = [
  {
    title: "miracle",
    meta: "founder since 2026",
    href: "https://miracledev.cc",
  },
  {
    title: "vocational college, computer science focus",
    meta: "2024 — 2026",
  },
  {
    title: "upcoming apprenticeship",
    meta: "software developer",
  },
]

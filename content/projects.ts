/**
 * Projects. `featured` gets the large preview card, `past` renders as cards
 * in the right-hand column of /projects.
 *
 * Logos live in /public/projects/. Leave `logo` null until the file exists —
 * pointing at a missing file makes the image optimiser return a 500.
 */

export type FeaturedProject = {
  name: string
  description: string
  /** Path in /public. `null` renders a typographic fallback panel. */
  image: string | null
  href: string
  secondary?: { label: string; href: string }
}

/** Discord-style role markers shown next to a project name. */
export type Badge = "owner" | "bughunter" | "innovator"

export type PastProject = {
  name: string
  description: string
  year: string
  href: string
  /** Path in /public. `null` falls back to the first letter. */
  logo: string | null
  badges?: Badge[]
}

export const featured: FeaturedProject = {
  name: "docsweb",
  description:
    "a self-hosted documentation platform and gitbook alternative, built to own your docs end to end.",
  image: "/projects/docsweb.png",
  href: "https://github.com/1llusionfx/docsweb",
  secondary: {
    label: "source",
    href: "https://github.com/1llusionfx/docsweb",
  },
}

export const past: PastProject[] = [
  {
    name: "miracle web",
    description: "our studio landing page.",
    year: "2026",
    href: "https://miracledev.cc",
    logo: "/projects/miracle-black.png",
    badges: ["owner"],
  },
  {
    name: "percs",
    description: "bio link — contributed as innovator and bug hunter.",
    year: "2026",
    href: "https://percs.cc",
    logo: "/projects/percs.webp",
    badges: ["innovator", "bughunter"],
  },
]

/**
 * Tech stack, grouped. `icon` is a key in components/ui/BrandIcon.tsx —
 * add the simple-icons import there before referencing a new one here.
 *
 * `note` shows on hover. These are neutral descriptions of what each tool is
 * for, plus a few that are specific to this site. Rewrite any of them in your
 * own words — they're the one place the stack page can say something.
 */

export type Skill = {
  name: string
  icon: string
  note?: string
}

export type SkillGroup = {
  title: string
  items: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: [
      {
        name: "TypeScript",
        icon: "typescript",
        note: "default for anything non-trivial — this site is strict-mode TS",
      },
      { name: "JavaScript", icon: "javascript", note: "scripts and quick tooling" },
      { name: "Python", icon: "python", note: "backends, automation, scraping" },
      { name: "Lua", icon: "lua", note: "embedded scripting" },
    ],
  },
  {
    title: "Frameworks & Libraries",
    items: [
      {
        name: "Next.js",
        icon: "nextjs",
        note: "app router — this portfolio runs on it",
      },
      { name: "React", icon: "react", note: "component model behind everything" },
      { name: "Astro", icon: "astro", note: "content-heavy sites with little JS" },
      {
        name: "TailwindCSS",
        icon: "tailwindcss",
        note: "v4, tokens defined in @theme — used throughout this site",
      },
      { name: "Node.js", icon: "nodejs", note: "server runtime and tooling" },
      { name: "Bun", icon: "bun", note: "faster installs and script running" },
      { name: "FastAPI", icon: "fastapi", note: "typed python APIs" },
    ],
  },
  {
    title: "Tools & Platforms",
    items: [
      { name: "Git", icon: "git", note: "clean branches, readable commits" },
      { name: "GitHub", icon: "github", note: "where the code lives" },
      { name: "VSCode", icon: "vscode", note: "arc blueberry, helium icons" },
      { name: "Docker", icon: "docker", note: "reproducible local services" },
      {
        name: "Cloudflare",
        icon: "cloudflare",
        note: "dns, proxying, and edge caching",
      },
      { name: "Postman", icon: "postman", note: "poking at APIs before writing clients" },
      { name: "PostgreSQL", icon: "postgresql", note: "relational store of choice" },
      {
        name: "Redis",
        icon: "redis",
        note: "in-memory store — backs the view counter on this site",
      },
      { name: "Obsidian", icon: "obsidian", note: "notes and project planning" },
      { name: "Linux", icon: "linux", note: "daily driver and deploy target" },
    ],
  },
]

export const skillsIntro =
  "a collection of languages, frameworks, and tools i reach for. this list reflects what i actually ship with, not what i've skimmed a tutorial of."

import {
  siAstro,
  siAsus,
  siBrave,
  siBun,
  siCloudflare,
  siDiscord,
  siDocker,
  siFastapi,
  siGit,
  siGithub,
  siJavascript,
  siJbl,
  siLinux,
  siLua,
  siMsi,
  siNextdotjs,
  siNodedotjs,
  siNordvpn,
  siObsidian,
  siPostgresql,
  siPostman,
  siPython,
  siRazer,
  siReact,
  siRedis,
  siSpotify,
  siTailwindcss,
  siTelegram,
  siTermius,
  siTypescript,
  siZenbrowser,
  siZsh,
} from "simple-icons"

/**
 * Brand marks, rendered as monochrome white.
 *
 * simple-icons ships one flat path per brand with no baked-in fill, so every
 * mark inherits `currentColor` and can never end up black on black.
 */

/** simple-icons dropped Microsoft's marks over licensing, so VS Code is inlined. */
const VSCODE_PATH =
  "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"

const registry: Record<string, string> = {
  astro: siAstro.path,
  asus: siAsus.path,
  brave: siBrave.path,
  bun: siBun.path,
  cloudflare: siCloudflare.path,
  discord: siDiscord.path,
  docker: siDocker.path,
  fastapi: siFastapi.path,
  git: siGit.path,
  github: siGithub.path,
  javascript: siJavascript.path,
  jbl: siJbl.path,
  linux: siLinux.path,
  lua: siLua.path,
  msi: siMsi.path,
  nextjs: siNextdotjs.path,
  nodejs: siNodedotjs.path,
  nordvpn: siNordvpn.path,
  obsidian: siObsidian.path,
  postgresql: siPostgresql.path,
  postman: siPostman.path,
  python: siPython.path,
  razer: siRazer.path,
  react: siReact.path,
  redis: siRedis.path,
  spotify: siSpotify.path,
  tailwindcss: siTailwindcss.path,
  telegram: siTelegram.path,
  termius: siTermius.path,
  typescript: siTypescript.path,
  vscode: VSCODE_PATH,
  zen: siZenbrowser.path,
  zsh: siZsh.path,
}

/**
 * Optical size correction.
 *
 * Brand marks aren't drawn to a shared optical scale: solid squares
 * (TypeScript, JavaScript, Redis) fill their whole 24x24 viewbox, while
 * outline or narrow marks (Next.js, Bun, Astro) sit inside it with padding.
 * Rendered at one nominal size they look visibly mismatched. These multipliers
 * even out the perceived weight; 1 means "already correct".
 */
const opticalScale: Record<string, number> = {
  typescript: 0.86,
  javascript: 0.86,
  redis: 0.94,
  postgresql: 0.94,
  github: 1.04,
  nextjs: 1.04,
  bun: 1.06,
  astro: 1.06,
  lua: 0.96,
  spotify: 0.96,
  discord: 1.02,
  asus: 1.1,
  msi: 1.06,
  jbl: 1.08,
  zsh: 1.04,
  nordvpn: 1.02,
  termius: 1,
  docker: 1.02,
  cloudflare: 1.06,
  vscode: 0.98,
}

export function BrandIcon({
  name,
  className = "size-3.5",
}: {
  name: string
  className?: string
}) {
  const path = registry[name]
  if (!path) return null

  const scale = opticalScale[name] ?? 1

  return (
    <svg
      role="img"
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
    >
      <path d={path} />
    </svg>
  )
}

export function hasBrandIcon(name: string) {
  return name in registry
}

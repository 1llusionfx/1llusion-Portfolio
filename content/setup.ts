/**
 * Hardware and software actually in use.
 *
 * `icon` accepts either a lucide key (monitor, mouse, keyboard, headphones,
 * code, globe, terminal, package) or a brand key from
 * components/ui/BrandIcon.tsx — brand marks win when both exist.
 *
 * `href` points at the official product or download page. Swap any of these
 * for store/affiliate links if you'd rather.
 */

export type SetupItem = {
  name: string
  icon: string
  /** dot-separated meta line */
  meta: string[]
  href?: string
}

export type TagItem = {
  name: string
  /** rendered after a middot in muted text */
  note?: string
  /** optional brand icon key */
  icon?: string
  href?: string
}

export const setupIntro =
  "the hardware, editor, and apps that show up in my workflow most days."

export const hardware: SetupItem[] = [
  {
    name: "MSI G274QPX",
    icon: "msi",
    meta: ["display", "27\"", "1440p", "240 Hz", "Rapid IPS"],
    href: "https://www.msi.com/Monitor/G274QPX",
  },
  {
    name: "JBL Tune Flex",
    icon: "jbl",
    meta: ["audio", "wireless", "noise cancelling"],
    href: "https://www.jbl.com/wireless-earbuds/JBLTUNEFLEX-.html",
  },
  {
    name: "Razer Basilisk V3",
    icon: "razer",
    meta: ["mouse", "wired"],
    href: "https://www.razer.com/gaming-mice/razer-basilisk-v3",
  },
  {
    name: "Ajazz AK820 Pro",
    icon: "keyboard",
    meta: ["keyboard", "mechanical", "75%"],
    href: "https://www.ajazzstore.com/products/ajazz-ak820-pro",
  },
]

export const workstation: SetupItem[] = [
  {
    name: "VS Code",
    icon: "vscode",
    meta: ["editor", "arc blueberry", "helium icons"],
    href: "https://code.visualstudio.com/",
  },
  {
    name: "Next.js",
    icon: "nextjs",
    meta: ["framework", "go-to for app work"],
    href: "https://nextjs.org/",
  },
  {
    name: "Zen Browser",
    icon: "zen",
    meta: ["browser", "primary", "daily driver"],
    href: "https://zen-browser.app/",
  },
  {
    name: "Brave",
    icon: "brave",
    meta: ["browser", "secondary"],
    href: "https://brave.com/",
  },
]

export const dock: TagItem[] = [
  { name: "Discord", icon: "discord", href: "https://discord.com/download" },
  { name: "Spotify", icon: "spotify", href: "https://www.spotify.com/download/" },
  { name: "Telegram", icon: "telegram", href: "https://desktop.telegram.org/" },
  { name: "Obsidian", icon: "obsidian", href: "https://obsidian.md/download" },
]

export const tools: TagItem[] = [
  {
    name: "Postman",
    note: "api client",
    icon: "postman",
    href: "https://www.postman.com/downloads/",
  },
  {
    name: "Termius",
    note: "ssh",
    icon: "termius",
    href: "https://termius.com/download",
  },
  {
    name: "NordVPN",
    note: "vpn",
    icon: "nordvpn",
    href: "https://nordvpn.com/download/",
  },
]

export const shell: TagItem[] = [
  { name: "zsh", note: "default", icon: "zsh", href: "https://www.zsh.org/" },
  { name: "git", icon: "git", href: "https://git-scm.com/downloads" },
]


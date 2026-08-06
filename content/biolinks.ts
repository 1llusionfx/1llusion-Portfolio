/**
 * Link-in-bio profiles.
 *
 * Favicons resolve automatically from each link's domain and double as a
 * blurred colour wash behind the row. Set `icon` to a path in /public to
 * override that — needed for hosts that don't serve a reachable favicon.
 */

export type Biolink = {
  name: string
  /** shown in muted text next to the name */
  display: string
  href: string
  note?: string
  /** optional local override, e.g. "/projects/percs.webp" */
  icon?: string
}

export const biolinksIntro = "my biolinks"

export const biolinks: Biolink[] = [
  {
    name: "guns.lol",
    display: "guns.lol/1ln",
    href: "https://guns.lol/1ln",
  },
  {
    // Uses the bundled mark rather than a favicon lookup — the site sits
    // behind Cloudflare and returns 530 to every non-browser request, so no
    // resolver can reach it.
    name: "percs",
    display: "percs.cc/1l",
    href: "https://percs.cc/1l",
    icon: "/projects/percs.webp",
  },
]

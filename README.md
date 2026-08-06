<div align="center">

# 1llusion.dev

Personal portfolio. Next.js 16, Tailwind CSS 4, Framer Motion.
Seven pages, one monochrome design system, live Discord and Last.fm data.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Live:** [1llusion.dev](https://1llusion.dev)

</div>

---

## Pages

| Route | Contents |
| ----- | -------- |
| `/` | Bio, socials, experience, live Discord presence, now-playing card with time-synced lyrics |
| `/projects` | Featured build and past collaborations |
| `/skills` | Tech stack, grouped |
| `/setup` | Hardware, workstation, tools |
| `/biolinks` | Link-in-bio profiles |
| `/contact` | Discord, GitHub, local-time clock |
| `/music` | Last.fm top albums, tracks, artists, and stats |

---

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in the Last.fm values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Everything renders without
credentials — `/music` shows an empty state and the view counter falls back to a
public service until they're set.

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `LASTFM_API_KEY` | for `/music` | [Create one here](https://www.last.fm/api/account/create) |
| `LASTFM_USERNAME` | for `/music` | Whose scrobbles to read |
| `KV_REST_API_URL` | optional | Upstash Redis for the view counter |
| `KV_REST_API_TOKEN` | optional | Injected automatically by Vercel |

Neither Last.fm value is prefixed `NEXT_PUBLIC_`, so the key is read only in
route handlers and never reaches the client bundle.

---

## Editing content

**All copy lives in `content/`.** No JSX editing required.

```
content/
├── site.ts          name, handle, bio, socials, experience, timezone
├── projects.ts      featured build + past collaborations
├── skills.ts        tech stack and the note shown on hover
├── setup.ts         hardware, workstation, dock, tools, shell
├── biolinks.ts      link-in-bio rows
└── commissions.ts   rates, process, FAQ
```

Images go in `public/projects/`. Any `image` or `logo` field set to `null`
renders a typographic fallback, so a missing file never breaks a card.

---

## Architecture

```
app/
├── api/
│   ├── lastfm/     top albums/tracks/artists, cached 1h
│   ├── lyrics/     lrclib proxy, parsed LRC, cached 24h
│   ├── favicon/    favicon resolver with an allowlist
│   └── views/      view counter (Upstash, with fallback)
├── globals.css     design tokens + shared transitions
├── layout.tsx      fonts, nav rail, backdrops
└── <route>/page.tsx
components/
├── layout/         PageShell, SideRail
├── spotify/        lyric fetching and playback position
└── ui/             design-system primitives
lib/                Last.fm client, motion tokens, utils
```

Every route is statically prerendered; only the four API handlers run per
request. Third-party calls (Lanyard, Last.fm, Deezer, lrclib, DuckDuckGo) are
made server-side and cached, so a visitor's browser talks only to this origin.

### Design system

Pure monochrome — emphasis comes from value contrast, not hue.

| | |
| --- | --- |
| Background | `#070707` with a soft centre glow, vignette, and grain |
| Surfaces | `#101012`, hairline borders, inner top highlight for depth |
| Type | Geist Sans · Geist Mono · Instrument Serif for italic accents |
| Motion | [transitions.dev](https://transitions.dev) token scale in `globals.css` |

Tokens are defined once under `@theme` and consumed as utilities
(`bg-surface`, `text-fg-muted`, `border-line`).

---

## Deploying

Built for Vercel; any Node host works.

1. Import the repository.
2. Add `LASTFM_API_KEY` and `LASTFM_USERNAME` under **Settings → Environment Variables**.
3. Optionally add **Storage → Upstash Redis** for a persistent view counter —
   the credentials are injected automatically and the counter switches over on
   the next deploy.

```bash
npm run build
```

---

## Credits

- [Lanyard](https://github.com/Phineas/lanyard) — Discord presence
- [lrclib](https://lrclib.net) — time-synced lyrics
- [simple-icons](https://simpleicons.org) · [thesvg](https://thesvg.org) — brand marks
- [oneko.js](https://github.com/adryd325/oneko.js) — the cat
- [transitions.dev](https://transitions.dev) — motion token scale

---

**1llusion** — [@1llusionfx](https://github.com/1llusionfx)

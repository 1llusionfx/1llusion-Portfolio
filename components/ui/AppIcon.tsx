"use client"

/**
 * Full-colour app and file-type marks from `thesvg`.
 *
 * Imported via per-icon subpaths, never from the package root. Two reasons:
 * the root barrel re-exports all 6,500 icons (a dynamic lookup there would
 * bundle every one), and that barrel ships TypeScript syntax inside a `.js`
 * file, which Turbopack refuses to parse. The subpath modules are clean ESM.
 */

import brave from "thesvg/brave"
import chrome from "thesvg/chrome"
import css from "thesvg/css"
import discord from "thesvg/discord"
import docker from "thesvg/docker"
import figma from "thesvg/figma"
import firefox from "thesvg/firefox"
import html5 from "thesvg/html5"
import javascript from "thesvg/javascript"
import json from "thesvg/json"
import markdown from "thesvg/markdown"
import notion from "thesvg/notion"
import obsidian from "thesvg/obsidian"
import postman from "thesvg/postman"
import python from "thesvg/python"
import react from "thesvg/react"
import roblox from "thesvg/roblox"
import rust from "thesvg/rust"
import spotify from "thesvg/spotify"
import steam from "thesvg/steam"
import telegram from "thesvg/telegram"
import typescript from "thesvg/typescript"
import visualStudioCode from "thesvg/visual-studio-code"
import youtube from "thesvg/youtube"
import zenBrowser from "thesvg/zen-browser"

type Icon = { svg: string; title: string }

/** Matched against the Discord activity name, lowercased. */
const apps: Record<string, Icon> = {
  "visual studio code": visualStudioCode,
  code: visualStudioCode,
  vscode: visualStudioCode,
  spotify,
  discord,
  "zen browser": zenBrowser,
  zen: zenBrowser,
  brave,
  telegram,
  obsidian,
  postman,
  docker,
  roblox,
  steam,
  notion,
  figma,
  youtube,
  chrome,
  "google chrome": chrome,
  firefox,
}

/** Matched against a filename extension. */
const languages: Record<string, Icon> = {
  ts: typescript,
  tsx: react,
  js: javascript,
  jsx: react,
  mjs: javascript,
  cjs: javascript,
  json,
  css,
  scss: css,
  html: html5,
  md: markdown,
  mdx: markdown,
  py: python,
  rs: rust,
}

function Svg({ icon, className }: { icon: Icon; className?: string }) {
  return (
    <span
      role="img"
      aria-label={icon.title}
      className={className}
      // Static markup from a bundled package — no user input reaches this.
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  )
}

export function AppIcon({
  name,
  className = "size-full",
}: {
  name: string
  className?: string
}) {
  const icon = apps[name.trim().toLowerCase()]
  if (!icon) return null
  return <Svg icon={icon} className={className} />
}

export function FileIcon({
  filename,
  className = "size-full",
}: {
  filename: string
  className?: string
}) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  const icon = languages[ext]
  if (!icon) return null
  return <Svg icon={icon} className={className} />
}

export function hasAppIcon(name: string) {
  return name.trim().toLowerCase() in apps
}

export function hasFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  return ext in languages
}

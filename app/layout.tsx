import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"

import "./globals.css"
import { SideRail } from "@/components/layout/SideRail"
import { SpotifyBackdrop } from "@/components/SpotifyBackdrop"
import { ViewCounter } from "@/components/ViewCounter"
import { site } from "@/content/site"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: `${site.name} | portfolio`,
  description: site.description,
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans bg-bg text-fg overflow-x-hidden`}
      >
        <div className="page-glow" aria-hidden />
        <SpotifyBackdrop />
        <div className="page-texture" aria-hidden />
        <div className="noise-overlay" aria-hidden />

        <SideRail />

        <div className="relative z-10 min-h-dvh">{children}</div>

        <ViewCounter />

        <Analytics />
        <Script src="/oneko.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}

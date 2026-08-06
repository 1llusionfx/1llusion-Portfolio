/**
 * Shared shapes for the Last.fm payload.
 *
 * Kept separate from lib/lastfm.ts because that module is marked
 * `server-only` — client components need the types without pulling in the
 * fetching code (and the API key access) alongside them.
 */

export type Album = {
  name: string
  artist: string
  image: string | null
  playcount: number
  url: string
}

export type Track = {
  name: string
  artist: string
  image: string | null
  playcount: number
  url: string
}

export type Artist = {
  name: string
  image: string | null
  playcount: number
  url: string
}

export type Stats = {
  scrobbles: number
  artists: number
  albums: number
  tracks: number
}

export type MusicPayload = {
  albums: Album[]
  tracks: Track[]
  artists: Artist[]
  stats: Stats
}

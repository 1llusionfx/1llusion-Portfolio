/** @type {import('next').NextConfig} */
const nextConfig = {
  // No `output: 'export'` — this deploys to Vercel with a real server, so
  // API routes can hold secrets and cache upstream responses.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'lastfm.freetls.fastly.net' },
      { protocol: 'https', hostname: 'cdn-images.dzcdn.net' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'www.google.com' },
      { protocol: 'https', hostname: 'icons.duckduckgo.com' }
    ]
  },
  devIndicators: false
};

export default nextConfig;

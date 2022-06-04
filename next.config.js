/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fe.dev.dxtr.asia'],
    minimumCacheTTL: 60,
  }
}

module.exports = nextConfig

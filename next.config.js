/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.JWT_SECRET
  },
  images: {
    domains: ['wallpapers.com']
  }
}

module.exports = nextConfig

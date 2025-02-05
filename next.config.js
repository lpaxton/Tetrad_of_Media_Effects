/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_ANTHROPIC_API_URL: process.env.NEXT_PUBLIC_ANTHROPIC_API_URL,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  }
};

module.exports = nextConfig;
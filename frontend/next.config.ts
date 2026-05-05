import type { NextConfig } from "next"
import { config } from "dotenv"
import { resolve } from "path"

// Charger le .env du dossier parent (racine du projet)
config({ path: resolve(__dirname, "../.env") })

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: `${process.env.API_URL}`,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
}

export default nextConfig

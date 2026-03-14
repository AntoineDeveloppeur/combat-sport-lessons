import type { NextConfig } from "next"
import { config } from "dotenv"
import { resolve } from "path"

// Charger le .env du dossier parent (racine du projet)
config({ path: resolve(__dirname, "../.env") })

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL,
  },
}

export default nextConfig

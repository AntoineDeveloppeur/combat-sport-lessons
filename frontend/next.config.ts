import type { NextConfig } from "next"
import { config } from "dotenv"
import { resolve } from "path"

// Charger le .env du dossier parent (racine du projet)
config({ path: resolve(__dirname, "../.env") })

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}`,
  },
}

export default nextConfig

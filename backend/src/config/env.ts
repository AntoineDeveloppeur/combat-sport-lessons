import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envPath = resolve(__dirname, "../../../.env")
console.log("📂 Chemin vers .env:", envPath)
console.log("📂 __dirname:", __dirname)

const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error("❌ Erreur dotenv:", result.error)
  throw result.error
}

console.log("📦 Variables chargées:", Object.keys(result.parsed || {}).length)

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans .env")
}

console.log("✅ Variables d'environnement chargées")

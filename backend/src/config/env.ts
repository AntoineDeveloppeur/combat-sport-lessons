import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envPath = resolve(__dirname, "../../../.env")
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error("❌ Erreur dotenv:", result.error)
  if (process.env.NODE_ENV !== "test") {
    throw result.error
  }
}

console.log(
  "📦 Variables d'environnement chargées:",
  Object.keys(result.parsed || {}).length
)

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "test") {
    process.env.JWT_SECRET = "test_secret_key_for_testing"
    console.log("⚠️  JWT_SECRET défini par défaut pour les tests")
  } else {
    throw new Error("JWT_SECRET manquant dans .env")
  }
}

if (
  !process.env.RECAPTCHA_SECRET_KEY &&
  process.env.NODE_ENV !== "development"
) {
  throw new Error("RECAPTCHA_SECRET_KEY manquant dans .env")
}

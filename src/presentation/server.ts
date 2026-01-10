import express from "express"
import userRoutes from "./routes/users.js"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

const port = 4000

// Middleware permettant de comprendre le format json
app.use(express.json())
// Permet de traiter les formulaires, l'option extended à true autorise l'analyse d'objets complexes et imbriqués
app.use(express.urlencoded({ extended: true }))

// Affiche la requête reçue
app.use((req, _res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.url}`
  const origin = req.get("Origin") || req.get("Referer") || "Direct access"
  console.log(
    `${req.method} ${fullUrl} - Origin: ${origin} - ${new Date().toISOString()}`
  )
  next()
})

// Charger le fichier OpenAPI depuis le dossier source
const swaggerDocument = YAML.load(
  join(__dirname, "../../../src/presentation/swagger/openapi.yaml")
)
// Documentation Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Repository Pattern API",
  })
)
// Export de la spec OpenAPI en JSON (pour import Postman)
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.json(swaggerDocument)
})
app.use("/users", userRoutes)
app.get("/", (_req, res) => {
  res.send(`
    <h1>Repository Pattern API</h1>
    <p>Documentation disponible sur <a href="/api-docs">/api-docs</a></p>
  `)
})
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`)
  console.log(`📚 Documentation Swagger: http://localhost:${port}/api-docs`)
  console.log(`📄 Spec OpenAPI JSON: http://localhost:${port}/api-docs.json`)
})

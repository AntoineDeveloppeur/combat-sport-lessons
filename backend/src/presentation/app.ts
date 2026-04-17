import "../config/env.js"

import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.js"
import lessonRoutes from "./routes/lesson.js"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const app = express()

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use((req, _res, next) => {
//   const fullUrl = `${req.protocol}://${req.get("host")}${req.url}`
//   const origin = req.get("Origin") || req.get("Referer") || "Direct access"
//   console.log(
//     `${req.method} ${fullUrl} - Origin: ${origin} - ${new Date().toISOString()}`,
//   )
//   console.log({ body: req.body })
//   next()
// })

const swaggerDocument = YAML.load(
  join(__dirname, "../presentation/swagger/openapi.yaml")
)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Repository Pattern API",
  })
)
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.json(swaggerDocument)
})
app.use("/users", userRoutes)
app.use("/lessons", lessonRoutes)
app.get("/", (_req, res) => {
  res.send(`
    <h1>Repository Pattern API</h1>
    <p>Documentation disponible sur <a href="/api-docs">/api-docs</a></p>
  `)
})

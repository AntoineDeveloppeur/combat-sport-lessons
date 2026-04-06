import { app } from "./app.js"
import "../config/env.js"

const port = process.env.PORT

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`)
  console.log(`📚 Documentation Swagger: http://localhost:${port}/api-docs`)
  console.log(`📄 Spec OpenAPI JSON: http://localhost:${port}/api-docs.json`)
})

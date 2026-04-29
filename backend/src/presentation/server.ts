import { app } from "./app.js"
import "../config/env.js"

const port = process.env.API_PORT

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`)
  console.log(
    `🔧 Environnement: ${process.env.NODE_ENV || "non défini (production par défaut)"}`
  )
})

import { app } from "./app.js"
import "../config/env.js"

const port = process.env.API_PORT

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur le port ${port}`)
})

import "../config/env.js"

import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.js"
import lessonRoutes from "./routes/lesson.js"

export const app = express()

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/users", userRoutes)
app.use("/lessons", lessonRoutes)
app.get("/", (_req, res) => {
  res.send(`<h1>Repository Pattern API</h1>`)
})

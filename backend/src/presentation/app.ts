import "../config/env.js"
import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.js"
import lessonRoutes from "./routes/lesson.js"

export const app = express()

app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/users", userRoutes)
app.use("/lessons", lessonRoutes)

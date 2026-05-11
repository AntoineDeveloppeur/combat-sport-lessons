import "../config/env.js"
import express from "express"
import cors from "cors"
import userRoutes from "./routes/users.js"
import lessonRoutes from "./routes/lesson.js"

export const app = express()

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL as string,
        "https://coursdecombat.fr",
        "https://www.coursdecombat.fr",
      ]

      // Accept server-to-server (Next.js SSR) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/users", userRoutes)
app.use("/lessons", lessonRoutes)

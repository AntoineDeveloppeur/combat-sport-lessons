import express, { Request, Response } from "express"
import { lessonCtrl } from "../controllers/lesson.js"

const router = express.Router()

router.get("/:id", (req: Request, res: Response) => {
  lessonCtrl.handleGet(req, res)
})

export default router

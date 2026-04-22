import express, { Request, Response } from "express"
import { lessonCtrl } from "../controllers/lesson.js"

const router = express.Router()

router.get("/:id", (req: Request, res: Response) => {
  lessonCtrl.handleGet(req, res)
})
router.get("/", (req: Request, res: Response) => {
  lessonCtrl.handleGetAll(req, res)
})
router.post("/", (req: Request, res: Response) => {
  lessonCtrl.handlePost(req, res)
})
router.patch("/:id/visibility", (req: Request, res: Response) => {
  lessonCtrl.handleToggleVisibility(req, res)
})
router.post("/:id/duplicate", (req: Request, res: Response) => {
  lessonCtrl.handleDuplicate(req, res)
})
router.delete("/:id", (req: Request, res: Response) => {
  lessonCtrl.handleDelete(req, res)
})
router.put("/:id", (req: Request, res: Response) => {
  lessonCtrl.handleUpdate(req, res)
})

export default router

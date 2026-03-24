import express from "express"
import { lessonCtrl } from "../controllers/lesson.js"
const router = express.Router()
router.get("/:id", (req, res) => {
  lessonCtrl.handleGet(req, res)
})
router.get("/", (req, res) => {
  lessonCtrl.handleGetAll(req, res)
})
router.post("/", (req, res) => {
  lessonCtrl.handlePost(req, res)
})
export default router

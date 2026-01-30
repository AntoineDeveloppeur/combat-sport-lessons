import express, { Request, Response } from "express"
import userCtrl from "../controllers/user.js"
const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  await userCtrl.handleCreateUser(req, res)
})

router.patch("/password", async (req: Request, res: Response) => {
  await userCtrl.handleUpdatePassword(req, res)
})

export default router

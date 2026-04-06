import express, { Request, Response } from "express"
import userCtrl from "../controllers/user.js"
const router = express.Router()

router.post("/sign-up", async (req: Request, res: Response) => {
  await userCtrl.handleCreateUser(req, res)
})

router.put("/password", async (req: Request, res: Response) => {
  await userCtrl.handleUpdatePassword(req, res)
})

router.post("/login", async (req: Request, res: Response) => {
  await userCtrl.handleLogin(req, res)
})

export default router

import express, { Request, Response } from "express"
import userCtrl from "../controllers/user.js"
import { createRecaptchaMiddleware } from "../middlewares/validateRecaptcha.js"

const router = express.Router()

router.post(
  "/sign-up",
  createRecaptchaMiddleware("signup"),
  async (req: Request, res: Response) => {
    await userCtrl.handleCreateUser(req, res)
  }
)

router.put("/password", async (req: Request, res: Response) => {
  await userCtrl.handleUpdatePassword(req, res)
})

router.post(
  "/login",
  createRecaptchaMiddleware("login"),
  async (req: Request, res: Response) => {
    await userCtrl.handleLogin(req, res)
  }
)

export default router

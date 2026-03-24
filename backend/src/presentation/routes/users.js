import express from "express"
import userCtrl from "../controllers/user.js"
const router = express.Router()
router.post("/", async (req, res) => {
  await userCtrl.handleCreateUser(req, res)
})
router.patch("/password", async (req, res) => {
  await userCtrl.handleUpdatePassword(req, res)
})
export default router

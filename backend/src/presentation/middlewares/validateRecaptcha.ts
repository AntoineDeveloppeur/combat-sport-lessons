import { Request, Response, NextFunction } from "express"
import { GoogleRecaptchaVerifier } from "../../infrastructure/services/GoogleRecaptchaVerifier.js"
import { InvalidCaptchaError } from "../../domain/errors/InvalidCaptchaError.js"

export function createRecaptchaMiddleware(action: string) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    ) {
      next()
      return
    }
    try {
      const { recaptchaToken } = req.body

      if (!recaptchaToken) {
        throw new InvalidCaptchaError()
      }

      const secretKey = process.env.RECAPTCHA_SECRET_KEY
      if (!secretKey) {
        throw new Error("RECAPTCHA_SECRET_KEY not configured")
      }

      const verifier = new GoogleRecaptchaVerifier(secretKey)
      await verifier.verify(recaptchaToken, action)

      next()
    } catch (error) {
      if (error instanceof InvalidCaptchaError) {
        console.error(error.log)
        res.status(error.status).json({ error: error.message })
        return
      }
      console.error("Unexpected error in recaptcha middleware:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}

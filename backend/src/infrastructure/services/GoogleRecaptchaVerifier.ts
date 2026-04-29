import { CaptchaVerifier } from "../../domain/services/CaptchaVerifier.js"
import { InvalidCaptchaError } from "../../domain/errors/InvalidCaptchaError.js"

interface RecaptchaResponse {
  success: boolean
  score: number
  action: string
  challenge_ts: string
  hostname: string
  "error-codes"?: string[]
}

export class GoogleRecaptchaVerifier implements CaptchaVerifier {
  private readonly secretKey: string
  private readonly minScore: number = 0.5

  constructor(secretKey: string) {
    this.secretKey = secretKey
  }

  async verify(
    token: string,
    action: string
  ): Promise<{ success: boolean; score: number }> {
    try {
      const response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${this.secretKey}&response=${token}`,
        }
      )

      if (!response.ok) {
        throw new InvalidCaptchaError()
      }

      const data: RecaptchaResponse =
        (await response.json()) as RecaptchaResponse

      if (!data.success) {
        throw new InvalidCaptchaError()
      }

      if (data.action !== action) {
        throw new InvalidCaptchaError()
      }

      if (data.score < this.minScore) {
        throw new InvalidCaptchaError(data.score)
      }

      return { success: true, score: data.score }
    } catch (error) {
      if (error instanceof InvalidCaptchaError) {
        throw error
      }
      throw new InvalidCaptchaError()
    }
  }
}

export interface CaptchaVerifier {
  verify(
    token: string,
    action: string
  ): Promise<{ success: boolean; score: number }>
}

export interface TokenManager {
  generateToken(userId: string): Promise<string>
  verifyToken(token: string): Promise<string>
}

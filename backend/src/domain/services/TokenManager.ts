export interface TokenManager {
  generateToken(userId: string): Promise<string>
  getUserIdFromToken(token: string): Promise<string>
}

type JwtPayload = {
  exp: number
  sub?: string
}

export function isTokenExpired(token: string): boolean {
  try {
    const payloadSegment = token.split(".")[1]
    if (!payloadSegment) return true
    const payload = JSON.parse(atob(payloadSegment)) as JwtPayload
    if (typeof payload.exp !== "number") return true
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

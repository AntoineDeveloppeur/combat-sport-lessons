"use client"

import { useEffect, ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

const PROTECTED_PREFIXES = ["/lessons/user", "/form"]

const isProtectedPath = (pathname: string): boolean =>
  PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [pathname, checkAuth])

  useEffect(() => {
    if (isProtectedPath(pathname) && !isAuthenticated) {
      router.replace("/login")
    }
  }, [pathname, isAuthenticated, router])

  if (isProtectedPath(pathname) && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

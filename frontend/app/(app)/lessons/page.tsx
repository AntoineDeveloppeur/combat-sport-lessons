"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LessonsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/lessons/user")
    } else {
      router.push("/lessons/visitor")
    }
  }, [isAuthenticated, router])

  return null
}

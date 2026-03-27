"use client"

import { useAuth } from "@/contexts/AuthContext"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function LessonsPage() {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      redirect("/lessons/user")
    } else {
      redirect("/lessons/visitor")
    }
  }, [isAuthenticated])

  return null
}

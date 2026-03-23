"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Combat Lessons
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/lessons">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Voir les lessons
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Se connecter
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-black hover:bg-white/90 font-bold">
                S&apos;inscrire
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

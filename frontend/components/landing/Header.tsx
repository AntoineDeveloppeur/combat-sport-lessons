"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { DesktopNav } from "./DesktopNav"
import { MobileNav } from "./MobileNav"

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

          <DesktopNav />
          <MobileNav />
        </nav>
      </div>
    </header>
  )
}

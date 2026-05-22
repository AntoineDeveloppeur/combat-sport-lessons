"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { DesktopNav } from "./DesktopNav"
import { MobileNav } from "./MobileNav"

export function Header() {
  const { scrollY } = useScroll()

  const backgroundColor = useTransform(
    scrollY,
    [0, 10],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.9)"]
  )

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor,
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="w-8" />
          <DesktopNav />
          <MobileNav />
        </nav>
      </div>
    </motion.header>
  )
}

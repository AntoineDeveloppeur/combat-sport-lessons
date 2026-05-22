"use client"

import { ReactNode, useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

interface ParallaxWrapperProps {
  children: ReactNode
  speed?: number
  className?: string
  stopAtCenter?: boolean
}

export function ParallaxWrapper({
  children,
  speed = 0.5,
  className = "",
  stopAtCenter = false,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const rawY = useTransform(
    scrollYProgress,
    stopAtCenter ? [0, 0.5, 1] : [0, 1],
    stopAtCenter ? [100 * speed, 0, 0] : [100 * speed, -100 * speed]
  )
  const y = useSpring(rawY, { stiffness: 100, damping: 30 })

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

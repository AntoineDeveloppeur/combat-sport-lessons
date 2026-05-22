"use client"

import Link from "next/link"
import { SectionContainer } from "./SectionContainer"
import { motion } from "framer-motion"

export function HeroSection() {
  const words = ["Découvrir,", "Créer", "et Partager"]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0,
      },
    },
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  }

  return (
    <SectionContainer backgroundImage="/mma.webp" backgroundColor="black">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="space-y-6">
          <motion.span
            className="flex flex-col md:flex-row items-center justify-center flex-wrap"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {words.map((word) => (
              <motion.span
                key={word}
                variants={wordVariants}
                className="text-5xl md:text-7xl font-bold"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.span>

          <motion.span
            className="block text-2xl md:text-3xl text-gray-300 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            des cours de sport de combat
          </motion.span>
        </h1>
      </div>

      <Link
        href="#discover"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:opacity-80 transition-opacity"
      >
        <svg
          className="w-6 h-6 text-white/50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </Link>
    </SectionContainer>
  )
}

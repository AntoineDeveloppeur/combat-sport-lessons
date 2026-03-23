"use client"

import { Header } from "@/components/landing/Header"
import { HeroSection } from "@/components/landing/HeroSection"
import { DiscoverSection } from "@/components/landing/DiscoverSection"
import { SignupSection } from "@/components/landing/SignupSection"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <DiscoverSection />
        <SignupSection />
      </main>
      <Footer />
    </div>
  )
}

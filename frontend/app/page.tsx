"use client"

import { Header } from "@/components/landing/Header"
import { HeroSection } from "@/components/landing/HeroSection"
import { DiscoverSection } from "@/components/landing/DiscoverSection"
import { CreateSection } from "@/components/landing/CreateSection"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <DiscoverSection />
        <CreateSection />
      </main>
      <Footer />
    </>
  )
}

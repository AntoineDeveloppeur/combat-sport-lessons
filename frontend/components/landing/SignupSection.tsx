"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SectionContainer } from "./SectionContainer"
import { SectionTitle } from "./SectionTitle"
import { ParallaxWrapper } from "./ParallaxWrapper"

const benefits = [
  {
    icon: "⚡",
    title: "Création rapide",
    description:
      "Interface intuitive pour structurer vos cours en quelques minutes",
  },
  {
    icon: "📄",
    title: "Export PDF instantané",
    description: "Téléchargez vos cours au format PDF prêt à imprimer",
  },
]

export function SignupSection() {
  return (
    <SectionContainer backgroundColor="black">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <ParallaxWrapper speed={-0.15}>
          <SectionTitle
            title="Prêt à créer vos propres cours ?"
            subtitle="Rejoignez la communauté des professeurs de sports de combat et commencez à organiser vos séances en quelques clics"
          />
        </ParallaxWrapper>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
          {benefits.map((benefit, index) => (
            <ParallaxWrapper key={benefit.title} speed={-0.1 * (index + 1)}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/70">{benefit.description}</p>
              </div>
            </ParallaxWrapper>
          ))}
        </div>

        <ParallaxWrapper speed={-0.05} className="pt-8">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold text-base md:text-xl px-8 md:px-12 py-4 md:py-6 whitespace-normal"
            >
              Inscription rapide pour créer votre premier cours - Complètement
              gratuit
            </Button>
          </Link>
        </ParallaxWrapper>
      </div>
    </SectionContainer>
  )
}

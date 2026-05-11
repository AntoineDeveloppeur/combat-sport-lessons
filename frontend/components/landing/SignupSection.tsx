"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SectionContainer } from "./SectionContainer"
import { SectionTitle } from "./SectionTitle"
import { FeatureCard } from "./FeatureCard"

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
  {
    icon: "🥋",
    title: "Toutes les disciplines",
    description: "Boxe, MMA, Judo, Karaté, Taekwondo et bien plus encore",
  },
]

export function SignupSection() {
  return (
    <SectionContainer backgroundColor="black">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <SectionTitle
          title="Prêt à créer vos propres cours ?"
          subtitle="Rejoignez la communauté des professeurs de sports de combat et commencez à organiser vos séances en quelques clics"
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          {benefits.map((benefit) => (
            <FeatureCard
              key={benefit.title}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              variant="dark"
            />
          ))}
        </div>

        <div className="pt-8">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold text-base md:text-xl px-8 md:px-12 py-4 md:py-6 whitespace-normal"
            >
              Commencer maintenant - C&apos;est gratuit
            </Button>
          </Link>
        </div>

        <p className="text-sm text-white/50 pt-4">
          Aucune carte bancaire requise • Accès immédiat
        </p>
      </div>
    </SectionContainer>
  )
}

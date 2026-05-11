"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SectionContainer } from "./SectionContainer"
import { FeatureCard } from "./FeatureCard"

const features = [
  {
    icon: "📚",
    title: "Découvrez des cours prêts à l'emploi",
    description:
      "Accédez à une bibliothèque de cours structurés : échauffement, thème principal et retour au calme. Gagnez du temps et trouvez l'inspiration.",
  },
  {
    icon: "✍️",
    title: "Créez vos propres cours",
    description:
      "Organisez facilement vos séances d'entraînement et exportez-les en PDF en un clic. Simple, rapide, efficace.",
  },
]

export function HeroSection() {
  return (
    <SectionContainer backgroundImage="/mma.webp" backgroundColor="black">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Créez et Partagez vos Cours de Sport de Combat
        </h1>

        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          La plateforme dédiée aux professeurs de sports de combat pour
          organiser, partager et découvrir des cours complets
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variant="dark"
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="#discover">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-black hover:bg-white/90 font-bold text-lg px-8"
            >
              Découvrir un exemple
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold text-lg px-8"
            >
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
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
      </div>
    </SectionContainer>
  )
}

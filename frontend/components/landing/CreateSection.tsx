"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap, ClipboardList, FileDown } from "lucide-react"
import { SectionContainer } from "./SectionContainer"
import { SectionTitle } from "./SectionTitle"
import { ParallaxWrapper } from "./ParallaxWrapper"

const features = [
  {
    icon: Zap,
    title: "Création rapide",
    description:
      "Interface intuitive pour structurer vos cours en quelques minutes",
  },
  {
    icon: ClipboardList,
    title: "Structure complète",
    description:
      "Organisez échauffement, corps de séance et retour au calme facilement",
  },
  {
    icon: FileDown,
    title: "Export PDF instantané",
    description: "Téléchargez vos cours au format PDF prêt à imprimer",
  },
]

export function CreateSection() {
  return (
    <SectionContainer backgroundColor="black">
      <div className="max-w-5xl mx-auto text-center">
        <ParallaxWrapper speed={0.8} stopAtCenter={true}>
          <SectionTitle
            title="Créez vos propres cours"
            subtitle="Rejoignez la communauté des professeurs de sports de combat et commencez à organiser vos séances en quelques clics"
          />
        </ParallaxWrapper>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all"
              >
                <Icon className="w-10 h-10 mb-4 text-white" />
                <h3 className="text-xl font-bold text-white mb-6">
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-20 flex flex-col gap-6">
          <Link href="/sign-up">
            <Button
              variant="link"
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold text-base md:text-xl px-8 md:px-12 py-4 md:py-6 whitespace-normal"
            >
              Inscription rapide et gratuite
            </Button>
          </Link>
          <Link href="/lessons">
            <Button
              size="lg"
              variant="link"
              className="text-white text-base md:text-xl hover:bg-white/10"
            >
              Consulter d&apos;abords les cours
            </Button>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/1.webp"
          alt="Combat sports training"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Créez et Partagez vos
            <br />
            <span className="text-white/90">Cours de Combat</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            La plateforme dédiée aux professeurs de sports de combat pour
            organiser, partager et découvrir des cours complets
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12 text-left">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
              <h3 className="text-xl font-bold mb-3">
                📚 Découvrez des cours prêts à l&apos;emploi
              </h3>
              <p className="text-white/70">
                Accédez à une bibliothèque de cours structurés : échauffement,
                thème principal et retour au calme. Gagnez du temps et trouvez
                l&apos;inspiration.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
              <h3 className="text-xl font-bold mb-3">
                ✍️ Créez vos propres cours
              </h3>
              <p className="text-white/70">
                Organisez facilement vos séances d&apos;entraînement et
                exportez-les en PDF en un clic. Simple, rapide, efficace.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="#discover">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white text-lg px-8"
              >
                Découvrir un exemple
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-bold text-lg px-8"
              >
                Commencer gratuitement
              </Button>
            </Link>
          </div>
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
    </section>
  )
}

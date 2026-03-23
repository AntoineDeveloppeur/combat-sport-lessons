"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function SignupSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/3.webp"
          alt="Martial arts practice"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold">
            Prêt à créer vos propres cours ?
          </h2>

          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Rejoignez la communauté des professeurs de sports de combat et
            commencez à organiser vos séances en quelques clics
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold mb-2">Création rapide</h3>
              <p className="text-white/70 text-sm">
                Interface intuitive pour structurer vos cours en quelques
                minutes
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-bold mb-2">Export PDF instantané</h3>
              <p className="text-white/70 text-sm">
                Téléchargez vos cours au format PDF prêt à imprimer
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-4xl mb-4">🥋</div>
              <h3 className="text-lg font-bold mb-2">Toutes les disciplines</h3>
              <p className="text-white/70 text-sm">
                Boxe, MMA, Judo, Karaté, Taekwondo et bien plus encore
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-bold text-xl px-12 py-6"
              >
                Commencer maintenant - C&apos;est gratuit
              </Button>
            </Link>
          </div>

          <p className="text-sm text-white/50 pt-4">
            Aucune carte bancaire requise • Accès immédiat
          </p>
        </div>
      </div>
    </section>
  )
}

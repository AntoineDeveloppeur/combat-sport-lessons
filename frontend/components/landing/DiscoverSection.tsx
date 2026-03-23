"use client"

import { Button } from "@/components/ui/button"
import { useGetLessonQuery } from "@/store/api/lessonApi"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import Image from "next/image"

export function DiscoverSection() {
  const { data, isLoading } = useGetLessonQuery(
    "550e8400-e29b-41d4-a716-446655440011"
  )

  const handleDownload = () => {
    if (data?.lesson) {
      buildAndDownloadPdf(data.lesson)
    }
  }

  return (
    <section
      id="discover"
      className="relative min-h-screen flex items-center justify-center bg-white text-black"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/2.webp"
          alt="Combat training session"
          fill
          className="object-cover opacity-10"
        />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold">
            Découvrez un cours exemple
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Téléchargez gratuitement un cours complet pour voir la qualité et la
            structure de nos lessons. Aucune inscription requise.
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-gray-500">Chargement du cours...</p>
            </div>
          ) : data?.lesson ? (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 max-w-2xl mx-auto">
              <div className="space-y-4 text-left">
                <div>
                  <span className="text-sm font-bold text-gray-500 uppercase">
                    Sport
                  </span>
                  <p className="text-2xl font-bold">{data.lesson.sport}</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-500 uppercase">
                    Titre
                  </span>
                  <p className="text-xl">{data.lesson.title}</p>
                </div>

                <div>
                  <span className="text-sm font-bold text-gray-500 uppercase">
                    Objectif
                  </span>
                  <p className="text-gray-700">{data.lesson.objective}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-300">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Échauffement</p>
                    <p className="text-lg font-bold">
                      {data.lesson.warmUpInstructions?.length || 0} exercices
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Corps de séance</p>
                    <p className="text-lg font-bold">
                      {data.lesson.bodyInstructions?.length || 0} exercices
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Retour au calme</p>
                    <p className="text-lg font-bold">
                      {data.lesson.coolDownInstructions?.length || 0} exercices
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                size="lg"
                className="w-full mt-8 bg-black text-white hover:bg-gray-800 font-bold text-lg"
              >
                📥 Télécharger ce cours en PDF
              </Button>
            </div>
          ) : (
            <p className="text-red-500">Impossible de charger le cours</p>
          )}

          <p className="text-sm text-gray-500 pt-8">
            Ce n&apos;est qu&apos;un exemple parmi des centaines de cours
            disponibles sur la plateforme
          </p>
        </div>
      </div>
    </section>
  )
}

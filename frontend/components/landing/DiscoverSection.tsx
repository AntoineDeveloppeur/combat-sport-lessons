"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import { SectionContainer } from "./SectionContainer"
import { SectionTitle } from "./SectionTitle"

export function DiscoverSection() {
  const { data, isLoading } = useGetAllLessonsQuery()
  const lesson = data?.lessons[0]

  const handleDownload = () => {
    if (lesson) {
      buildAndDownloadPdf(lesson)
    }
  }

  return (
    <SectionContainer
      id="discover"
      backgroundImage="/boxe.webp"
      backgroundColor="white"
      imageOpacity={0.1}
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <SectionTitle
          title="Découvrez un cours exemple"
          subtitle="Téléchargez gratuitement un cours complet pour voir la qualité et la structure de nos lessons. Aucune inscription requise."
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            <p className="text-gray-500">Chargement du cours...</p>
          </div>
        ) : lesson ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="space-y-4">
              <div>
                <CardDescription className="uppercase">Sport</CardDescription>
                <CardTitle className="text-2xl">{lesson.sport}</CardTitle>
              </div>
              <div>
                <CardDescription className="uppercase">Titre</CardDescription>
                <CardTitle className="text-xl font-normal">
                  {lesson.title}
                </CardTitle>
              </div>
              <div>
                <CardDescription className="uppercase">
                  Objectif
                </CardDescription>
                <p className="text-gray-700">{lesson.objective}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Échauffement</p>
                  <p className="text-lg font-bold">
                    {lesson.warmUpInstructions?.length || 0} exercices
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Corps de séance</p>
                  <p className="text-lg font-bold">
                    {lesson.bodyInstructions?.length || 0} exercices
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Retour au calme</p>
                  <p className="text-lg font-bold">
                    {lesson.coolDownInstructions?.length || 0} exercices
                  </p>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                size="lg"
                className="w-full bg-black text-white hover:bg-gray-800 font-bold"
              >
                📥 Télécharger ce cours en PDF
              </Button>
            </CardContent>
          </Card>
        ) : (
          <p className="text-red-500">Impossible de charger le cours</p>
        )}
      </div>
    </SectionContainer>
  )
}

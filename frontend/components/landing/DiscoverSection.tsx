"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { FileDown } from "lucide-react"
import { useGetAllLessonsQuery } from "@/store/api/lessonApi"
import { buildAndDownloadPdf } from "@/utils/buildAndDownloadPdf"
import { SectionContainer } from "./SectionContainer"
import { SectionTitle } from "./SectionTitle"
import { ParallaxWrapper } from "./ParallaxWrapper"

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
        <ParallaxWrapper speed={0.8} stopAtCenter={true}>
          <SectionTitle
            title="Découvrez des cours prêts à l'emploi"
            subtitle="Tous les cours sont disponibles gratuitement et sans inscription. Voici un exemple ci-dessous."
          />
        </ParallaxWrapper>

        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            <p className="text-gray-500">Chargement du cours...</p>
          </div>
        ) : lesson ? (
          <Card className="max-w-2xl w-fit  px-auto mx-auto">
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
              <Button
                onClick={handleDownload}
                size="lg"
                className="w-auto bg-black text-white hover:bg-gray-800 font-bold flex items-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Télécharger en PDF
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

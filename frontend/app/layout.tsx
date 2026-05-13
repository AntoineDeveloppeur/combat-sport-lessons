import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppProvider } from "./provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Cours de combat - Créez et partagez vos cours de sport de combat",
    template: "%s | Cours de combat",
  },
  description:
    "Cours de combat est une application web dédiée aux entraîneurs et pratiquants de sports de combat. Créez, organisez et partagez vos cours pour la boxe, le MMA, le judo, la lutte et bien plus.",
  keywords: [
    "sports de combat",
    "leçons",
    "entraînement",
    "entraîneur",
    "arts martiaux",
    "boxe",
    "MMA",
    "judo",
    "lutte",
    "coach",
    "cours",
  ],
  authors: [{ name: "Cours de combat" }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://coursdecombat.fr",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  openGraph: {
    title: "Cours de combat - Créez et partagez vos cours de sport de combat",
    description:
      "Créez, organisez et partagez vos cours pour tous les sports de combat.",
    type: "website",
    url: "https://coursdecombat.fr",
    siteName: "Cours de combat",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary",
    title: "Cours de combat - Créez et partagez vos cours de sport de combat",
    description: "Créez et partagez vos cours pour tous les sports de combat.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cours de combat",
  url: "https://coursdecombat.fr",
  description:
    "Application web pour créer et partager des cours de sports de combat.",
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  inLanguage: "fr",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <AppProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </body>
      </AppProvider>
    </html>
  )
}

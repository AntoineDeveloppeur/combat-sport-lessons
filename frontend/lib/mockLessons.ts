import { Lesson } from "@/types"

export const mockLessons: Lesson[] = [
  {
    lessonId: "1",
    title: "Technique de base - Jab et Direct",
    sport: "Boxe",
    objective:
      "Apprendre les fondamentaux du jab et du direct en travaillant la précision et la vitesse d'exécution",
    duration: 45,
    createdAt: new Date("2024-03-10"),
    author: "Coach Martin",
  },
  {
    lessonId: "2",
    title: "Enchaînements avancés",
    sport: "Boxe",
    objective:
      "Maîtriser les combinaisons de 4-5 coups avec déplacements latéraux pour améliorer la fluidité en combat",
    duration: 60,
    createdAt: new Date("2024-03-12"),
    author: "Coach Martin",
  },
  {
    lessonId: "3",
    title: "Cardio et endurance",
    sport: "MMA",
    objective:
      "Développer l'endurance cardiovasculaire spécifique au MMA avec des rounds de haute intensité",
    duration: 30,
    createdAt: new Date("2024-03-08"),
    author: "Coach Sarah",
  },
  {
    lessonId: "4",
    title: "Transitions debout-sol",
    sport: "MMA",
    objective:
      "Travailler les transitions fluides entre combat debout et combat au sol, incluant les takedowns et la défense",
    duration: 50,
    createdAt: new Date("2024-03-15"),
    author: "Coach Sarah",
  },
  {
    lessonId: "5",
    title: "Kicks de base - Mae Geri",
    sport: "Karaté",
    objective:
      "Perfectionner le Mae Geri (coup de pied frontal) en travaillant l'équilibre, la puissance et la précision",
    duration: 40,
    createdAt: new Date("2024-03-11"),
    author: "Sensei Tanaka",
  },
  {
    lessonId: "6",
    title: "Kata Heian Shodan",
    sport: "Karaté",
    objective:
      "Apprendre et mémoriser le kata Heian Shodan avec une attention particulière sur la posture et le timing",
    duration: 55,
    createdAt: new Date("2024-03-14"),
    author: "Sensei Tanaka",
  },
  {
    lessonId: "7",
    title: "Défense et esquives",
    sport: "Boxe",
    objective:
      "Améliorer les réflexes défensifs avec des exercices d'esquive, de blocage et de contre-attaque immédiate",
    duration: 35,
    createdAt: new Date("2024-03-09"),
    author: "Coach Martin",
  },
  {
    lessonId: "8",
    title: "Grappling et soumissions",
    sport: "MMA",
    objective:
      "Étudier les techniques de grappling au sol et pratiquer les soumissions de base (armbar, triangle, guillotine)",
    duration: 65,
    createdAt: new Date("2024-03-13"),
    author: "Coach Sarah",
  },
  {
    lessonId: "9",
    title: "Kumite - Combat libre",
    sport: "Karaté",
    objective:
      "Pratiquer le kumite (combat libre) en appliquant les techniques apprises dans un contexte de sparring contrôlé",
    duration: 45,
    createdAt: new Date("2024-03-16"),
    author: "Sensei Tanaka",
  },
  {
    lessonId: "10",
    title: "Conditionnement physique",
    sport: "Boxe",
    objective:
      "Renforcer la condition physique générale avec des exercices spécifiques à la boxe (shadow boxing, sac, corde à sauter)",
    duration: 40,
    createdAt: new Date("2024-03-07"),
    author: "Coach Martin",
  },
]

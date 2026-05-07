"use client"
import { usePathname } from "next/navigation"

export const Stepper = () => {
  const pathname = usePathname()

  const highlight = (path: string): string => {
    return pathname === path
      ? "font-bold text-blue-600"
      : "font-medium text-gray-600"
  }
  return (
    <nav className="w-full py-6">
      <ol className="flex justify-between w-full">
        <li className="flex-1 text-center">
          <p className={highlight("/form/general")}>Général</p>
        </li>
        <li className="flex-1 text-center">
          <p
            href="/form/echauffement"
            className={highlight("/form/echauffement")}
          >
            Échauffement
          </p>
        </li>
        <li className="flex-1 text-center">
          <p href="/form/corps" className={highlight("/form/corps")}>
            Corps de séance
          </p>
        </li>
        <li className="flex-1 text-center">
          <p href="/form/calme" className={highlight("/form/calme")}>
            Retour au calme
          </p>
        </li>
      </ol>
    </nav>
  )
}

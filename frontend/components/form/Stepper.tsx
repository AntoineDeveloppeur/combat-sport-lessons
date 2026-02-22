"use client"
import Link from "next/link"
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
          <Link href="/form/general" className={highlight("/form/general")}>
            Général
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link
            href="/form/echauffement"
            className={highlight("/form/echauffement")}
          >
            Échauffement
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link href="/form/corps" className={highlight("/form/corps")}>
            Corps de séance
          </Link>
        </li>
        <li className="flex-1 text-center">
          <Link href="/form/calme" className={highlight("/form/calme")}>
            Retour au calme
          </Link>
        </li>
      </ol>
    </nav>
  )
}

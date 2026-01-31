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
          <span className={highlight("/form/contact")}>Contact</span>
        </li>
        <li className="flex-1 text-center">
          <span className={highlight("/form/education")}>Education</span>
        </li>
        <li className="flex-1 text-center">
          <span className={highlight("/form/about")}>About</span>
        </li>
        <li className="flex-1 text-center">
          <span className={highlight("/form/confirm")}>Confirm</span>
        </li>
      </ol>
    </nav>
  )
}

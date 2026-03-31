import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-4">
      <Link href="/lessons">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white"
        >
          Voir les lessons
        </Button>
      </Link>
      <Link href="/login">
        <Button
          variant="outline"
          className="bg-white text-black hover:bg-white/90 font-bold"
        >
          Se connecter
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button className="bg-white text-black hover:bg-white/90 font-bold">
          S&apos;inscrire
        </Button>
      </Link>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-black text-white border-white/10"
      >
        <SheetHeader>
          <SheetTitle className="text-white text-left">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Link href="/lessons" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white text-lg"
            >
              Voir les lessons
            </Button>
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white text-lg"
            >
              Se connecter
            </Button>
          </Link>
          <Link href="/sign-up" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white text-lg"
            >
              S&apos;inscrire
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

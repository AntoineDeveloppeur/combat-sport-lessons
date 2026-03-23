"use client"

import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-4">Combat Lessons</h3>
            <p className="text-white/70 mb-6">
              La plateforme dédiée aux professeurs de sports de combat pour
              créer, organiser et partager leurs cours.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <p className="text-white/70 mb-2">
              Une question ? Contactez-nous :
            </p>
            <a
              href="mailto:contact@combatlessons.com"
              className="text-white hover:text-white/80 underline"
            >
              contact@combatlessons.com
            </a>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="max-w-4xl mx-auto">
          <h4 className="text-sm font-bold mb-3">Crédits photos</h4>
          <div className="text-xs text-white/50 space-y-1">
            <p>
              Image par{" "}
              <a
                href="https://pixabay.com/fr/users/harutmovsisyan-2839589/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1514845"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Harut Movsisyan
              </a>{" "}
              de{" "}
              <a
                href="https://pixabay.com/fr//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1514845"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pixabay
              </a>
            </p>
            <p>
              Image par{" "}
              <a
                href="https://pixabay.com/fr/users/pranongcreative-4130073/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3897488"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                PranongCreative
              </a>{" "}
              de{" "}
              <a
                href="https://pixabay.com/fr//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3897488"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pixabay
              </a>
            </p>
            <p>
              Image par{" "}
              <a
                href="https://pixabay.com/fr/users/antfrank-3804109/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1842466"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                antfrank
              </a>{" "}
              de{" "}
              <a
                href="https://pixabay.com/fr//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1842466"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pixabay
              </a>
            </p>
            <p>
              Image par{" "}
              <a
                href="https://pixabay.com/fr/users/mickeylit-611797/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8509963"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mickey Mikolauskas
              </a>{" "}
              de{" "}
              <a
                href="https://pixabay.com/fr//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8509963"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pixabay
              </a>
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="text-center text-white/50 text-sm">
          <p>© 2026 Combat Lessons. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

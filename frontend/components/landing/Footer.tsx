"use client"

import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h4 className="text-sm font-bold mb-3">Contact</h4>
            <p className="text-xs text-white/50 mb-2">
              Une question ? Contactez-nous :
            </p>
            <a
              href="mailto:antoine.developpeur@gmail.com"
              className="text-xs text-white/50 hover:text-white/80 underline"
            >
              antoine.developpeur@gmail.com
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">Crédits photos</h4>
            <div className="text-xs text-white/50 space-y-1">
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
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">Protection</h4>
            <p className="text-xs text-white/50">
              Ce site est protégé par reCAPTCHA et les{" "}
              <a
                href="https://policies.google.com/privacy"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Règles de confidentialité
              </a>{" "}
              et{" "}
              <a
                href="https://policies.google.com/terms"
                className="hover:text-white/70 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conditions d&apos;utilisation
              </a>{" "}
              de Google s&apos;appliquent.
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-white/10" />

        <div className="text-center text-white/50 text-sm">
          <p>© 2026 Combat Lessons. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

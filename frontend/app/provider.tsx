"use client"

import { Provider } from "react-redux"
import { store } from "@/store/index"
import { AuthProvider } from "@/contexts/AuthContext"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { usePathname } from "next/navigation"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const pathname = usePathname()

  return (
    <Provider store={store}>
      <AuthProvider>
        <GoogleReCaptchaProvider
          reCaptchaKey={recaptchaSiteKey || ""}
          key={pathname}
        >
          {children}
        </GoogleReCaptchaProvider>
      </AuthProvider>
    </Provider>
  )
}

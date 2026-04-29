"use client"

import { Provider } from "react-redux"
import { store } from "@/store/index"
import { AuthProvider } from "@/contexts/AuthContext"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  return (
    <Provider store={store}>
      <AuthProvider>
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey || ""}>
          {children}
        </GoogleReCaptchaProvider>
      </AuthProvider>
    </Provider>
  )
}

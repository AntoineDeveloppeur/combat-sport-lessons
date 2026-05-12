import { AppProvider } from "../provider"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AuthGuard>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <div className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            {children}
          </div>
        </div>
      </AuthGuard>
    </AppProvider>
  )
}

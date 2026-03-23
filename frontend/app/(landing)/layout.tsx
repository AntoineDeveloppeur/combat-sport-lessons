import { AppProvider } from "../provider"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppProvider>{children}</AppProvider>
}

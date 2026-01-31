import { Stepper } from "@/components/Stepper"

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Stepper />
      {children}
    </>
  )
}

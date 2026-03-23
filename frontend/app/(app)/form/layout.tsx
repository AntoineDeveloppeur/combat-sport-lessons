import { Stepper } from "@/components/form/Stepper"

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

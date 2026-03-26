import { Stepper } from "@/components/lessonForm/Stepper"

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

import Image from "next/image"
import { ReactNode } from "react"

interface SectionContainerProps {
  id?: string
  children: ReactNode
  backgroundImage?: string
  backgroundColor?: "black" | "white"
  imageOpacity?: number
}

export function SectionContainer({
  id,
  children,
  backgroundImage,
  backgroundColor = "black",
  imageOpacity = 0.4,
}: SectionContainerProps) {
  const bgColor =
    backgroundColor === "black" ? "bg-black text-white" : "bg-white text-black"

  return (
    <section
      id={id}
      className={`relative min-h-screen flex items-center justify-center ${bgColor}`}
    >
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Background"
              fill
              className="object-cover"
              style={{ opacity: imageOpacity }}
            />
          </div>
          {backgroundColor === "black" && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black z-0" />
          )}
        </>
      )}

      <div className="container mx-auto px-6 py-32 relative z-10">
        {children}
      </div>
    </section>
  )
}

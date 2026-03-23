interface SectionTitleProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
}: SectionTitleProps) {
  return (
    <div className={`space-y-4 ${centered ? "text-center" : ""}`}>
      <h2 className="text-4xl md:text-6xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-xl text-current opacity-80 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}

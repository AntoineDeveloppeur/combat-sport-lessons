import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  variant?: "light" | "dark"
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = "dark",
}: FeatureCardProps) {
  const isDark = variant === "dark"

  return (
    <Card
      className={`${
        isDark
          ? "bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      } transition-all`}
    >
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 ${isDark ? "text-white" : "text-black"}`}
        >
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
        <CardDescription className={isDark ? "text-white/70" : "text-gray-600"}>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

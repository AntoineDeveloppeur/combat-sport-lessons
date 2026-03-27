"use client"

import { Button } from "@/components/ui/button"

interface LessonFiltersProps {
  activeFilter: "all" | "mine"
  onFilterChange: (filter: "all" | "mine") => void
}

export function LessonFilters({
  activeFilter,
  onFilterChange,
}: LessonFiltersProps) {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={activeFilter === "mine" ? "default" : "outline"}
        onClick={() => onFilterChange("mine")}
        size="lg"
      >
        Mes lessons
      </Button>
      <Button
        variant={activeFilter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
        size="lg"
      >
        Toutes les lessons
      </Button>
    </div>
  )
}

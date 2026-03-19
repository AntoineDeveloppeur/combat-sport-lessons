import { Lesson, InstructionType } from "@/types"

export const calculateLessonDuration = (lesson: Lesson): number => {
  let totalSeconds = 0

  const allInstructions: InstructionType[] = [
    ...(lesson.warmUpInstructions || []),
    ...(lesson.bodyInstructions || []),
    ...(lesson.coolDownInstructions || []),
  ]

  for (const instruction of allInstructions) {
    totalSeconds += instruction.min * 60 + instruction.sec
  }

  const totalMinutes = totalSeconds / 60

  return Math.ceil(totalMinutes)
}

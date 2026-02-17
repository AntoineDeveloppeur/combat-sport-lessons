import { Lesson } from "@/types"
import { defaultValues } from "@/data/instructionDefaultValues"

export function getInstructionDefaultValue(
  lesson: Lesson,
  fieldName: keyof Lesson
) {
  const res = lesson[fieldName]
    ? lesson
    : {
        [fieldName]: defaultValues,
      }
  return res
}

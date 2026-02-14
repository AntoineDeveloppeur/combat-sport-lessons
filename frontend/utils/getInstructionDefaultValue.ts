import { Lesson } from "@/types"

export function getInstructionDefaultValue(
  lesson: Lesson,
  fieldName: keyof Lesson
) {
  const res = lesson[fieldName]
    ? lesson
    : {
        [fieldName]: [{ text: "", min: 1, sec: 0 }],
      }
  return res
}

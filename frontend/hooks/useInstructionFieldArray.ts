import { useFieldArray, FieldArrayWithId, Control } from "react-hook-form"
import { type Lesson } from "@/types"
import { useState, useEffect } from "react"

interface UseInstructionFieldArrayReturn {
  addInstruction: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: FieldArrayWithId<any, string, "id">[]
}

export function useInstructionFieldArray(
  lesson: Lesson,
  fieldName: keyof Lesson,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
): UseInstructionFieldArrayReturn {
  const [instructionCount, setInstructionCount] = useState<number>(
    lesson[fieldName]?.length || 1
  )
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control,
  })

  const addInstruction = () => {
    setInstructionCount((prev) => prev + 1)
  }

  useEffect(() => {
    const newVal = instructionCount
    const oldVal = fields.length
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ text: "", min: 1, sec: 0 })
      }
    } else {
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1)
      }
    }
  }, [instructionCount, append, remove, fields.length])

  return { addInstruction, fields }
}

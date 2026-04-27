import { InstructionType } from "@/types"
import { createTiptapJSON } from "@/utils/tiptapHelpers"

export const defaultValues: InstructionType[] = [
  {
    text: createTiptapJSON(""),
    min: 1,
    sec: 0,
  },
]

export interface InstructionType {
  text: string
  min: number
  sec: number
}

// None of the properties are mandatory to allow futur incomplete saving
export interface Lesson {
  id?: number
  sport?: string
  title?: string
  objective?: string
  warmUp?: "custom" | "preset"
  coolDown?: "custom" | "preset"
  warmUpInstructions?: InstructionType[]
  bodyInstructions?: InstructionType[]
  coolDownInstructions?: InstructionType[]
  warmUpPresetTitle?: string
  coolDownPresetTitle?: string
  createdAt?: Date
  duration?: number
  author?: string
}

export type LessonInstructionKey =
  | "warmUpInstructions"
  | "bodyInstructions"
  | "coolDownInstructions"

export type Preset = Record<string, InstructionType[]>

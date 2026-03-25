export interface InstructionType {
  text: string
  min: number
  sec: number
}

// None of the properties are mandatory to allow futur incomplete saving
export interface Lesson {
  id?: string
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
  userId?: string
}

export type LessonInstructionKey =
  | "warmUpInstructions"
  | "bodyInstructions"
  | "coolDownInstructions"

export type Preset = Record<string, InstructionType[]>

export interface Login {
  email: string
  password: string
}

export interface SignUp {
  name: string
  email: string
  password: string
}

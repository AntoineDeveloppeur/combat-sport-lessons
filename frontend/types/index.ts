export interface TiptapJSON {
  type: "doc"
  content?: Array<{
    type: string
    content?: Array<{
      type: string
      text?: string
      marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
      attrs?: Record<string, unknown>
    }>
    attrs?: Record<string, unknown>
  }>
}

export interface InstructionType {
  text: TiptapJSON
  min: number
  sec: number
}

// None of the properties are mandatory to allow futur incomplete DB saving
export interface Lesson {
  lessonId?: string
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
  isPublic?: boolean
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

export interface BackendError {
  data: {
    error: string
  }
}

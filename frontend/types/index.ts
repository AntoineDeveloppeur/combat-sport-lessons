export interface InstructionType {
  text: string
  min: number
  sec: number
}

// None of the properties are mandatory to allow futur incomplete saving
export interface Lesson {
  sport?: string
  objective?: string
  warmUp?: "custom" | "preset"
  coolDown?: "custom" | "preset"
  warmUpInstructions?: InstructionType[]
  password?: string
  confirmPassword?: string
  university?: string
  degree?: string
  about?: string
}

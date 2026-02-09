export interface InstructionType {
  text: string
  min: number
  sec: number
}

export interface FormState {
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

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
  bodyInstructions?: InstructionType[]
  coolDownInstructions?: InstructionType[]
  warmUpPresetTitle?: string
  coolDownPresetTitle?: string
}

export type Preset = Record<string, InstructionType[]>

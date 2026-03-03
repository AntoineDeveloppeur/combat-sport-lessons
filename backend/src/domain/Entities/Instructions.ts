export interface Instruction {
  text: string
  min: number
  sec: number
}

// duration could minutes of work or work + rest
// For now the best is to keep duration as string and let people write what they want

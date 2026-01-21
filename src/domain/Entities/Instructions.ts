import { DurationStrict } from "./DurationStrict"

export interface Instruction {
  title?: string
  mainContent: string
  duration: string | DurationStrict
  objective?: string
}

// duration could minutes of work or work + rest
// For now the best is to keep duration as string and let people write what they want

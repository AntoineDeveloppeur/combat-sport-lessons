import { Sport } from "../../domain/type"

export interface LessonDBRow {
  lesson_id: number
  title: string
  sport: string
  objective: string
  warmUp: string
  coolDown: string
  warmUpPresetTitle: string | null
  coolDownPresetTitle: string | null
  created_at: string
  user_id: number
}

export interface InstructionDBRow {
  instruction_id: number
  text: string
  type: string
  min: number
  sec: number
  order: number
  lesson_id: number
}

export interface LessonDBwithInstructionRow {
  lesson_id: number
  title: string
  sport: Sport
  objective: string
  created_at: Date
  user_id: number
  text: string
  type: string
  min: number
  sec: number
  order: number
}

export interface PostgreSQLResult<T> {
  rows: T[]
}

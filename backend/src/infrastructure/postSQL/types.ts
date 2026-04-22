import { Sport } from "../../domain/type"

export interface LessonDBRow {
  lesson_id: string
  title: string
  sport: string
  objective: string
  warm_up: string
  cool_down: string
  warm_up_preset_title: string | null
  cool_down_preset_title: string | null
  created_at: string
  user_id: string
  is_public: boolean
}

export interface InstructionDBRow {
  instruction_id: string
  text: string
  type: string
  min: number
  sec: number
  order: number
  lesson_id: string
}

export interface LessonDBwithInstructionRow {
  lesson_id: string
  title: string
  sport: Sport
  objective: string
  created_at: Date
  user_id: string
  is_public: boolean
  warm_up: "custom" | "preset"
  cool_down: "custom" | "preset"
  text: string
  type: string
  min: number
  sec: number
  order: number
}

export interface PostgreSQLResult<T> {
  rows: T[]
}

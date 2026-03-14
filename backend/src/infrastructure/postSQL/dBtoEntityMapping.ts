import { Lesson } from "../../domain/Entities/Lesson.js"
import type { Sport } from "../../domain/type.js"
// Types "bruts" de la base de données
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
  title: string
  text: string
  type: string
  min: number
  sec: number
  order: number
  lesson_id: number
}

// Types de résultat PostgreSQL
export interface PostgreSQLResult<T> {
  rows: T[]
}

export const dBtoEntityMapping = (
  lessonDB: PostgreSQLResult<LessonDBRow>,
  warmUpInstructionsDB: PostgreSQLResult<InstructionDBRow>,
  bodyInstructionsDB: PostgreSQLResult<InstructionDBRow>,
  coolDownInstructionsDB: PostgreSQLResult<InstructionDBRow>
): Lesson => {
  const { lesson_id, user_id, created_at, sport, ...rest } = lessonDB.rows[0]
  const lesson = {
    lessonId: lesson_id,
    userId: user_id,
    creationDate: new Date(created_at),
    sport: sport as Sport,
    ...rest,
    warmUpInstructions: warmUpInstructionsDB.rows,
    bodyInstructions: bodyInstructionsDB.rows,
    coolDownInstructions: coolDownInstructionsDB.rows,
  }
  return lesson
}

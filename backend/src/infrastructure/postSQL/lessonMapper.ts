import { Lesson } from "../../domain/Entities/Lesson.js"
import type { Sport } from "../../domain/type.js"
import type {
  LessonDBRow,
  InstructionDBRow,
  LessonDBwithInstructionRow,
  PostgreSQLResult,
} from "./types.js"

export const mapOne = (
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

export const mapMany = (
  lessonsDB: PostgreSQLResult<LessonDBwithInstructionRow>
): Lesson[] => {
  const map = new Map()

  for (const lessonDB of lessonsDB.rows) {
    const lessonMap = map.get(lessonDB.lesson_id)

    if (!lessonMap) {
      const { lesson_id, user_id, title, sport, objective, created_at } =
        lessonDB
      const lessonTemp = {
        lessonId: lesson_id,
        userId: user_id,
        title,
        objective,
        creationDate: new Date(created_at),
        sport: sport as Sport,
      }
      const lessonForMap = addInstructions(lessonTemp, lessonDB)
      map.set(lessonDB.lesson_id, lessonForMap)
    } else {
      const lessonForMap = addInstructions(lessonMap, lessonDB)
      map.set(lessonDB.lesson_id, lessonForMap)
    }
  }

  const res: Lesson[] = []
  for (const value of map) {
    res.push(value[1])
  }
  return res
}

export const addInstructions = (
  lesson: Partial<Lesson>,
  lessonDBwithInstructionRow: LessonDBwithInstructionRow
): Partial<Lesson> => {
  const res: Partial<Lesson> = { ...lesson }
  const { text, type, min, sec, order } = lessonDBwithInstructionRow

  const instructionTypeMap: Record<
    string,
    keyof Pick<
      Lesson,
      "bodyInstructions" | "warmUpInstructions" | "coolDownInstructions"
    >
  > = {
    body: "bodyInstructions",
    warm_up: "warmUpInstructions",
    cool_down: "coolDownInstructions",
  }

  const instructionKey = instructionTypeMap[type]
  if (instructionKey) {
    if (res[instructionKey]) {
      res[instructionKey].push({ text, min, sec, order })
    } else {
      res[instructionKey] = [{ text, min, sec, order }]
    }
  }

  return res
}

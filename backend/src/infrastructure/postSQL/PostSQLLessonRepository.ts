import { lessonRepository } from "../../domain/repositories/lessonRepository.js"
import { Lesson } from "../../domain/Entities/Lesson.js"
import { Pool } from "pg"
import * as lessonMapper from "./lessonMapper.js"
import { IdGenerator } from "../../domain/services/IdGenerator.js"
import { buildInstructionsQuery } from "./buildInstructionsQuery.js"
import { LessonIdNotFound } from "../../domain/errors/LessonIdNotFound.js"
import { LessonTransactionError } from "../../domain/errors/LessonTransactionError.js"

export class PostSQLLessonRepository implements lessonRepository {
  constructor(public readonly pool: Pool) {}
  async get(lessonId: string): Promise<Lesson> {
    // récupère la lesson
    const query = `
      SELECT * FROM lessons WHERE lesson_id = $1
    `
    const lessonDB = await this.pool.query(query, [lessonId])
    if (lessonDB.rows.length === 0) {
      throw new LessonIdNotFound(lessonId)
    }

    // récupère les différentes instructions
    const queryInstructions = `
    SELECT * FROM instructions WHERE lesson_id = $1 AND type = $2 ORDER BY "order"
    `
    const warmUpInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "warm_up",
    ])
    const bodyInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "body",
    ])
    const coolDownInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "cool_down",
    ])
    return lessonMapper.mapOne(
      lessonDB,
      warmUpInstructionsDB,
      bodyInstructionsDB,
      coolDownInstructionsDB
    )
  }
  async getAll(): Promise<Lesson[]> {
    const query = `
      SELECT l.lesson_id, l.title, l.sport, l.objective, l.created_at, l.user_id, i.text, i.type, i.min, i.sec, i.order 
      FROM lessons l
      LEFT JOIN instructions i
      ON l.lesson_id = i.lesson_id
      ORDER by l.lesson_id
    `
    const lessonDB = await this.pool.query(query)

    return lessonMapper.mapMany(lessonDB)
  }
  async save(lesson: Lesson, IdGenerator: IdGenerator): Promise<void> {
    const lessonId = IdGenerator.generate()
    const userId = "550e8400-e29b-41d4-a716-446655440001"
    const warm_up = "custom"
    const cool_down = "custom"
    const warm_up_preset_title = null
    const cool_down_preset_title = null
    const paramsLesson = [
      lessonId,
      lesson.title,
      lesson.sport,
      lesson.objective,
      warm_up,
      cool_down,
      warm_up_preset_title,
      cool_down_preset_title,
      lesson.creationDate,
      userId,
    ]

    const queryLesson = `
      INSERT INTO lessons (lesson_id, title, sport, objective, warm_up, cool_down, warm_up_preset_title, cool_down_preset_title, created_at, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `

    const [queryInstructions, paramsInstructions] = buildInstructionsQuery(
      lesson.warmUpInstructions,
      lesson.bodyInstructions,
      lesson.coolDownInstructions,
      lessonId,
      IdGenerator
    )

    await this.pool.query("BEGIN")
    try {
      await this.pool.query(queryLesson, paramsLesson)
      await this.pool.query(queryInstructions, paramsInstructions)
      await this.pool.query("COMMIT")
    } catch (error) {
      await this.pool.query("ROLLBACK")
      throw new LessonTransactionError(lesson, error as Error)
    }
  }
}

import { lessonRepository } from "../../domain/repositories/lessonRepository.js"
import { Lesson } from "../../domain/Entities/Lesson.js"
import { Pool } from "pg"
import * as lessonMapper from "./lessonMapper.js"
import { IdGenerator } from "../../domain/services/IdGenerator.js"
import { buildInstructionsQuery } from "./buildInstructionsQuery.js"
import { LessonIdNotFound } from "../../domain/errors/LessonIdNotFound.js"
import { LessonTransactionError } from "../../domain/errors/LessonTransactionError.js"
import { NotOwner } from "../../domain/errors/NotOwner.js"

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
      SELECT l.lesson_id, l.title, l.sport, l.objective, l.created_at, l.user_id, l.is_public, l.warm_up,l.cool_down, i.text, i.type, i.min, i.sec, i.order 
      FROM lessons l
      LEFT JOIN instructions i
      ON l.lesson_id = i.lesson_id
      ORDER by l.lesson_id
    `
    const lessonDB = await this.pool.query(query)

    return lessonMapper.mapMany(lessonDB)
  }
  async save(
    lesson: Lesson,
    userId: string,
    IdGenerator: IdGenerator
  ): Promise<string> {
    const lessonId = IdGenerator.generate()
    const warm_up = "custom"
    const cool_down = "custom"
    const warm_up_preset_title = null
    const cool_down_preset_title = null
    const is_public = false
    const paramsLesson = [
      lessonId,
      lesson.title,
      lesson.sport,
      lesson.objective,
      warm_up,
      cool_down,
      warm_up_preset_title,
      cool_down_preset_title,
      userId,
      is_public,
    ]

    const queryLesson = `
      INSERT INTO lessons (lesson_id, title, sport, objective, warm_up, cool_down, warm_up_preset_title, cool_down_preset_title, user_id, is_public)
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
      return lessonId
    } catch (error) {
      await this.pool.query("ROLLBACK")
      throw new LessonTransactionError(lesson, error as Error)
    }
  }

  async updateVisibility(lessonId: string, isPublic: boolean): Promise<void> {
    const query = `
      UPDATE lessons
      SET is_public = $1
      WHERE lesson_id = $2
    `
    await this.pool.query(query, [isPublic, lessonId])
  }

  async duplicate(
    lessonId: string,
    userId: string,
    idGenerator: IdGenerator
  ): Promise<Lesson> {
    const sourceLesson = await this.get(lessonId)

    const baseTitle = sourceLesson.title
    const titleQuery = `
      SELECT title FROM lessons 
      WHERE title LIKE $1 AND user_id = $2
      ORDER BY title
    `
    const existingTitles = await this.pool.query(titleQuery, [
      `${baseTitle}%`,
      userId,
    ])

    let newTitle = `${baseTitle} (copie)`
    if (existingTitles.rows.length > 0) {
      const titles = existingTitles.rows.map((row) => row.title)
      let counter = 1
      while (titles.includes(newTitle)) {
        counter++
        newTitle = `${baseTitle} (copie ${counter})`
      }
    }

    const newLessonId = idGenerator.generate()
    const queryLesson = `
      INSERT INTO lessons (lesson_id, title, sport, objective, warm_up, cool_down, warm_up_preset_title, cool_down_preset_title, user_id, is_public)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    const paramsLesson = [
      newLessonId,
      newTitle,
      sourceLesson.sport,
      sourceLesson.objective,
      "custom",
      "custom",
      null,
      null,
      userId,
      false,
    ]

    const [queryInstructions, paramsInstructions] = buildInstructionsQuery(
      sourceLesson.warmUpInstructions,
      sourceLesson.bodyInstructions,
      sourceLesson.coolDownInstructions,
      newLessonId,
      idGenerator
    )

    await this.pool.query("BEGIN")
    try {
      await this.pool.query(queryLesson, paramsLesson)
      await this.pool.query(queryInstructions, paramsInstructions)
      await this.pool.query("COMMIT")

      return await this.get(newLessonId)
    } catch (error) {
      await this.pool.query("ROLLBACK")
      throw new LessonTransactionError(sourceLesson, error as Error)
    }
  }

  async delete(lessonId: string, userId: string): Promise<void> {
    const lesson = await this.get(lessonId)

    if (lesson.userId !== userId) {
      throw new NotOwner(userId, lessonId)
    }

    const query = `
      DELETE FROM lessons WHERE lesson_id = $1
    `
    await this.pool.query(query, [lessonId])
  }

  async titleExistsGlobally(
    title: string,
    excludeLessonId?: string
  ): Promise<boolean> {
    const query = excludeLessonId
      ? `SELECT EXISTS(SELECT 1 FROM lessons WHERE title = $1 AND lesson_id != $2)`
      : `SELECT EXISTS(SELECT 1 FROM lessons WHERE title = $1)`

    const params = excludeLessonId ? [title, excludeLessonId] : [title]
    const result = await this.pool.query(query, params)

    return result.rows[0].exists
  }

  async update(
    lessonId: string,
    lesson: Lesson,
    idGenerator: IdGenerator
  ): Promise<Lesson> {
    const queryLesson = `
      UPDATE lessons 
      SET title = $1, sport = $2, objective = $3
      WHERE lesson_id = $4
    `
    const paramsLesson = [
      lesson.title,
      lesson.sport,
      lesson.objective,
      lessonId,
    ]

    const deleteInstructionsQuery = `
      DELETE FROM instructions WHERE lesson_id = $1
    `

    const [queryInstructions, paramsInstructions] = buildInstructionsQuery(
      lesson.warmUpInstructions,
      lesson.bodyInstructions,
      lesson.coolDownInstructions,
      lessonId,
      idGenerator
    )

    await this.pool.query("BEGIN")
    try {
      await this.pool.query(queryLesson, paramsLesson)
      await this.pool.query(deleteInstructionsQuery, [lessonId])
      await this.pool.query(queryInstructions, paramsInstructions)
      await this.pool.query("COMMIT")

      return await this.get(lessonId)
    } catch (error) {
      await this.pool.query("ROLLBACK")
      throw new LessonTransactionError(lesson, error as Error)
    }
  }
}

import { lessonRepository } from "../../domain/repositories/lessonRepository.js"
import { Lesson } from "../../domain/Entities/Lesson.js"
import { Pool } from "pg"
import { dBtoEntityMapping } from "./dBtoEntityMapping.js"
import { dbtoEntityMappingGetAll } from "./dbtoEntityMappingGetAll.js"

export class PostSQLLessonRepository implements lessonRepository {
  constructor(public readonly pool: Pool) {}
  async get(lessonId: number): Promise<Lesson> {
    // récupère la lesson
    const query = `
      SELECT * FROM lessons WHERE lesson_id = $1
    `
    const lessonDB = await this.pool.query(query, [lessonId])

    // récupère les différentes instructions
    const queryInstructions = `
    SELECT * FROM instructions WHERE lesson_id = $1 AND type = $2 ORDER BY "order"
    `
    const warmUpInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "warmUp",
    ])
    const bodyInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "body",
    ])
    const coolDownInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "coolDown",
    ])
    return dBtoEntityMapping(
      lessonDB,
      warmUpInstructionsDB,
      bodyInstructionsDB,
      coolDownInstructionsDB
    )
  }
  // il faut que je récupère les instructions liées au lessons pour en faire un objet
  async getAll(): Promise<Lesson[]> {
    const query = `
      SELECT l.lesson_id, l.title, l.sport, l.objective, l.created_at, l.user_id, i.text, i.type, i.min, i.sec, i.order 
      FROM lessons l
      LEFT JOIN instructions i
      ON l.lesson_id = i.lesson_id
      ORDER by l.lesson_id
    `
    const lessonDB = await this.pool.query(query)

    console.log("lessonDBgetAll", lessonDB.rows)
    return dbtoEntityMappingGetAll(lessonDB)
  }
}

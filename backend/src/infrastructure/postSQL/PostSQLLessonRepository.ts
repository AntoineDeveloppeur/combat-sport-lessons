import { lessonRepository } from "../../domain/repositories/lessonRepository.js"
import { Lesson } from "../../domain/Entities/Lesson.js"
import { Pool } from "pg"
import { dBtoEntityMapping } from "./dBtoEntityMapping.js"

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
      coolDownInstructionsDB,
    )
  }
}

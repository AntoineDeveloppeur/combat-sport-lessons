import { lessonRepository } from "../../domain/repositories/lessonRepository.js"
import { Lesson } from "../../domain/Entities/Lesson.js"
import { Pool } from "pg"
import { mockLesson } from "../../data/mockLesson.js"
import { dBtoEntityMapping } from "./dBtoEntityMapping.js"

export class PostSQLessonRepository implements lessonRepository {
  constructor(public readonly pool: Pool) {}
  async get(lessonId: number): Promise<Lesson> {
    // récupère la lesson
    const query = `
      SELECT * FROM lessons WHERE lesson_id = $1
    `
    const lessonDB = await this.pool.query(query, [lessonId])
    console.log("lessonDB.rows", lessonDB.rows)
    // récupère les instructions associés
    // warmUP
    const queryInstructions = `
    SELECT * FROM instructions WHERE lesson_id = $1 AND type = $2 ORDER BY "order"
    `
    const warmUpInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "warmUp",
    ])
    console.log("warmUpInstructionsDB.rows", warmUpInstructionsDB.rows)
    const bodyInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "body",
    ])
    console.log("bodyInstructionsDB.rows", bodyInstructionsDB.rows)
    const coolDownInstructionsDB = await this.pool.query(queryInstructions, [
      lessonId,
      "coolDown",
    ])
    const lesson = dBtoEntityMapping(
      lessonDB,
      warmUpInstructionsDB,
      bodyInstructionsDB,
      coolDownInstructionsDB,
    )
    // mapper result en lesson object
    return mockLesson
  }
}

import { lessonRepository } from "../../domain/repositories/lessonRepository.js"
import { mockLesson } from "../../data/mockLesson.js"
import { Lesson } from "../../domain/Entities/Lesson.js"

export class PostSQLessonRepository implements lessonRepository {
  async get(lessonId: number): Promise<Lesson> {
    console.log(lessonId)
    const lesson = mockLesson
    return lesson
  }
}

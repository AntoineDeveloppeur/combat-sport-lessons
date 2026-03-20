import { Lesson } from "../Entities/Lesson"
import { IdGenerator } from "../services/IdGenerator"

export interface lessonRepository {
  get(lessonId: string): Promise<Lesson>
  getAll(): Promise<Lesson[]>
  save(lesson: Lesson, IdGenerator: IdGenerator): Promise<void>
}

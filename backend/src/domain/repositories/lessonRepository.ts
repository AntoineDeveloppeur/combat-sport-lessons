import { Lesson } from "../Entities/Lesson"
import { IdGenerator } from "../services/IdGenerator"

export interface lessonRepository {
  get(lessonId: string): Promise<Lesson>
  getAll(): Promise<Lesson[]>
  save(
    lesson: Lesson,
    userId: string,
    IdGenerator: IdGenerator,
  ): Promise<string>
  updateVisibility(lessonId: string, isPublic: boolean): Promise<void>
}

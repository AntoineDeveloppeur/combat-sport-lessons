import { Lesson } from "../Entities/Lesson"
import { IdGenerator } from "../services/IdGenerator"

export interface lessonRepository {
  get(lessonId: string): Promise<Lesson>
  getAll(): Promise<Lesson[]>
  save(
    lesson: Lesson,
    userId: string,
    IdGenerator: IdGenerator
  ): Promise<string>
  updateVisibility(lessonId: string, isPublic: boolean): Promise<void>
  duplicate(
    lessonId: string,
    userId: string,
    idGenerator: IdGenerator
  ): Promise<Lesson>
  delete(lessonId: string, userId: string): Promise<void>
  titleExistsGlobally(title: string, excludeLessonId?: string): Promise<boolean>
  update(
    lessonId: string,
    lesson: Lesson,
    idGenerator: IdGenerator
  ): Promise<Lesson>
}

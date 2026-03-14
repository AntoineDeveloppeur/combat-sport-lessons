import { Lesson } from "../Entities/Lesson"

export interface lessonRepository {
  get(lessonId: number): Promise<Lesson>
  getAll(): Promise<Lesson[]>
}

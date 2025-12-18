export interface Lesson {
  title: string
  body: string
  discipline: Array<string>
  postLesson: Promise<void>
}

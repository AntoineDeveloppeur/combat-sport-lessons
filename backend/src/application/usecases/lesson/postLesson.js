export async function postLesson(lesson, lessonRepository, idGenerator) {
  await lessonRepository.save(lesson, idGenerator)
}

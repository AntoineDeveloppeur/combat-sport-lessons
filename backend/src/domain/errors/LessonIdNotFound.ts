export class LessonIdNotFound extends Error {
  status: number = 400
  constructor(id: string) {
    super(
      `La leçon avec l'identifiant ${id} n'a pas été trouvé dans la base de donnée`
    )
  }
}

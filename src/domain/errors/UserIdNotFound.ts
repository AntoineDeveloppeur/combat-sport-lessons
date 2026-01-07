export class UserIdNotFound extends Error {
  status: number = 500
  constructor(id: string) {
    super(`id : ${id} pas trouvée dans la base de donnée`)
  }
}

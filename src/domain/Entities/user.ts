import { randomUUID } from "node:crypto"
export default class User {
  id: string
  name: string
  email: string
  accessRight: "administrator" | "moderator" | "user" = "user"
  constructor(user: { name: string; email: string }) {
    this.name = user.name
    this.email = user.email
    this.id = randomUUID()
  }
}

export class User {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly hash: string
  role: "administrator" | "moderator" | "user" = "user"
  constructor(user: {
    id: string
    name: string
    email: string
    hash: string
    role: "administrator" | "moderator" | "user"
  }) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.hash = user.hash
    if (user.role) this.role = user.role
  }
}

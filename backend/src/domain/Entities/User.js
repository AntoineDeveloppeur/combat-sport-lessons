export class User {
  id
  name
  email
  hash
  accessRight = "user"
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.hash = user.hash
  }
}

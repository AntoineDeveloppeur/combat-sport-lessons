class StorageError extends Error {
  status: number = 500
  constructor(message) {
    super(message)
  }
}

class EmailAlreadyUsed extends Error {
  status: number = 400
  constructor(email) {
    super(`${email} est déjà utilisé`)
  }
}

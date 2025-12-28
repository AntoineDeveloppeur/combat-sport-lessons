export class StorageError extends Error {
  status: number = 500
  constructor(message: string) {
    super(message)
    this.name = "storageError"
  }
}

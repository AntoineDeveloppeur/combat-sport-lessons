import { randomUUID } from "node:crypto"
import { IdGenerator } from "../../domain/services/IdGenerator.js"

export class RandomUUIDGenerator implements IdGenerator {
  generate(): string {
    return randomUUID()
  }
}

import { randomUUID } from "node:crypto"
import { IdGenerator } from "../../domain/services/IdGenerator"

export class RandomUUIDGenerator implements IdGenerator {
  generate() {
    return randomUUID()
  }
}

import { randomUUID } from "node:crypto"
export class RandomUUIDGenerator {
  generate() {
    return randomUUID()
  }
}

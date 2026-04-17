import { testPool } from "../infrastructure/postSQL/testPool.js"

export async function cleanDatabase() {
  await testPool.query("TRUNCATE TABLE instructions CASCADE")
  await testPool.query("TRUNCATE TABLE lessons CASCADE")
  await testPool.query("TRUNCATE TABLE users CASCADE")
}

export async function closeTestDatabase() {
  await testPool.end()
}

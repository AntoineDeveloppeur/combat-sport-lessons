import { pool } from "./postSQLPool.js"
import { testPool } from "./testPool.js"
import type { Pool } from "pg"

export function getPool(): Pool {
  const isTestEnv = process.env.NODE_ENV === "test" || process.env.VITEST === "true"
  return isTestEnv ? testPool : pool
}

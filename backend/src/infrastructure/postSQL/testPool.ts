import pg from "pg"

const { Pool } = pg

export const testPool = new Pool({
  host: "localhost",
  port: 5433,
  user: "postgres",
  password: "password",
  database: "repository_pattern_test_db",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

testPool.on("connect", () => {
  console.log("Connected to PostgreSQL TEST database")
})

testPool.on("error", (err) => {
  console.error("Unexpected error on idle test client", err)
  process.exit(-1)
})

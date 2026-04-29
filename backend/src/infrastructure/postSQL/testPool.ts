import pg from "pg"

const { Pool } = pg

export const testPool = new Pool({
  host: process.env.POSTGRES_TEST_HOST || "localhost",
  port: Number(process.env.POSTGRES_TEST_PORT) || 5433,
  user: process.env.POSTGRES_TEST_USER || "user",
  password: process.env.POSTGRES_TEST_PASSWORD || "password",
  database: process.env.POSTGRES_TEST_DB || "test",
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

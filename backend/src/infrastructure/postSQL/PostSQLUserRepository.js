import { UserIdNotFound } from "../../domain/errors/UserIdNotFound.js"
import { EmailNotFound } from "../../domain/errors/EmailNotFound.js"
export class PostSQLUserRepository {
  pool
  constructor(pool) {
    this.pool = pool
  }
  async create(user) {
    const { id, name, email, hash, accessRight } = user
    const query = `
      INSERT INTO users (id, name, email, hash, access_right)
      VALUES ($1,$2,$3,$4,$5)
    `
    await this.pool.query(query, [id, name, email, hash, accessRight])
  }
  async isEmailAlreadyUsed(email) {
    const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists`
    const result = await this.pool.query(query, [email])
    return result.rows[0].exists
  }
  async getHash(id) {
    const query = `SELECT hash FROM users WHERE id = $1`
    const result = await this.pool.query(query, [id])
    if (result.rows.length === 0) {
      throw new UserIdNotFound(id)
    }
    return result.rows[0].hash
  }
  async updatePassword(id, hash) {
    const query = `UPDATE users SET hash = $1 WHERE id = $2`
    const result = await this.pool.query(query, [hash, id])
    if (result.rowCount === 0) {
      throw new UserIdNotFound(id)
    }
  }
  async findUserId(email) {
    const query = `SELECT id FROM users WHERE email = $1`
    const result = await this.pool.query(query, [email])
    if (result.rows.length === 0) {
      throw new EmailNotFound(email)
    }
    return result.rows[0].id
  }
}

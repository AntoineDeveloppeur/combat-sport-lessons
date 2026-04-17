import { describe, test, expect, beforeEach, afterAll } from "vitest"
import request from "supertest"
import { app } from "../presentation/app.js"
import { cleanDatabase, closeTestDatabase } from "./setup.js"

let testCounter = 0

describe("Users integration tests", () => {
  afterAll(async () => {
    await closeTestDatabase()
  })

  describe("POST /users", () => {
    beforeEach(async () => {
      await cleanDatabase()
    })

    test("crée un utilisateur et retourne token + userId", async () => {
      const response = await request(app).post("/users/sign-up").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      })

      expect(response.status).toBe(201)
      expect(response.body.token).toBeDefined()
      expect(response.body.userId).toBeDefined()
      expect(typeof response.body.token).toBe("string")
      expect(typeof response.body.userId).toBe("string")
    })

    test("retourne 409 si email existe déjà", async () => {
      await request(app).post("/users/sign-up").send({
        name: "Jane",
        email: "jane@example.com",
        password: "password",
      })

      const response = await request(app).post("/users/sign-up").send({
        name: "Jane2",
        email: "jane@example.com",
        password: "password2",
      })

      expect(response.status).toBe(409)
      expect(response.body.error).toBeDefined()
    })

    test("valide que le hash est bien stocké en DB", async () => {
      const createResponse = await request(app).post("/users/sign-up").send({
        name: "Alice",
        email: "alice@test.com",
        password: "mypassword",
      })

      expect(createResponse.status).toBe(201)

      const loginResponse = await request(app).post("/users/login").send({
        email: "alice@test.com",
        password: "mypassword",
      })

      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body.token).toBeDefined()
    })
  })

  describe("POST /users/login", () => {
    let loginEmail: string

    beforeEach(async () => {
      await cleanDatabase()
      loginEmail = `login-${++testCounter}@example.com`
      await request(app).post("/users/sign-up").send({
        name: "TestUser",
        email: loginEmail,
        password: "testpass123",
      })
    })

    test("retourne token avec credentials corrects", async () => {
      const response = await request(app).post("/users/login").send({
        email: loginEmail,
        password: "testpass123",
      })

      expect(response.status).toBe(200)
      expect(response.body.token).toBeDefined()
      expect(response.body.userId).toBeDefined()
    })

    test("retourne erreur avec mauvais password", async () => {
      const response = await request(app).post("/users/login").send({
        email: loginEmail,
        password: "wrongpassword",
      })

      expect(response.status).toBe(401)
    })

    test("retourne erreur avec email inexistant", async () => {
      const response = await request(app).post("/users/login").send({
        email: "notfound@example.com",
        password: "anypassword",
      })

      expect(response.status).toBe(404)
    })
  })

  describe("PUT /users/password", () => {
    let passwordEmail: string

    beforeEach(async () => {
      await cleanDatabase()
      passwordEmail = `password-${++testCounter}@example.com`
      await request(app).post("/users/sign-up").send({
        name: "PasswordUser",
        email: passwordEmail,
        password: "oldpassword",
      })
    })

    test("met à jour le password avec current password correct", async () => {
      const response = await request(app).put("/users/password").send({
        email: passwordEmail,
        currentPassword: "oldpassword",
        newPassword: "newpassword123",
      })

      expect(response.status).toBe(200)

      const loginResponse = await request(app).post("/users/login").send({
        email: passwordEmail,
        password: "newpassword123",
      })

      expect(loginResponse.status).toBe(200)
    })

    test("retourne erreur si current password incorrect", async () => {
      const response = await request(app).put("/users/password").send({
        email: passwordEmail,
        currentPassword: "wrongpassword",
        newPassword: "newpassword123",
      })

      expect(response.status).toBe(401)
    })
  })
})

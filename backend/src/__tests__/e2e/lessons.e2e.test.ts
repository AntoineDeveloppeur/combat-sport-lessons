import { describe, test, expect, beforeEach, afterAll } from "vitest"
import request from "supertest"
import { app } from "../../presentation/app.js"
import { cleanDatabase, closeTestDatabase } from "./setup.js"

describe("Lessons E2E", () => {
  let userToken: string

  beforeEach(async () => {
    await cleanDatabase()
    const userResponse = await request(app).post("/users/sign-up").send({
      name: "TestUser",
      email: "test@example.com",
      password: "password123",
    })
    userToken = userResponse.body.token
  })

  afterAll(async () => {
    await closeTestDatabase()
  })

  describe("GET /lessons", () => {
    test("retourne un tableau vide si aucune lesson", async () => {
      const response = await request(app).get("/lessons")

      expect(response.status).toBe(200)
      expect(response.body.lessons).toEqual([])
    })

    test("retourne toutes les lessons publiques", async () => {
      const lesson = {
        title: "Boxe débutant",
        sport: "Boxe",
        objective: "Apprendre les bases",
        warmUpInstructions: [
          { text: "Échauffement", min: 5, sec: 0, order: 1 },
        ],
        bodyInstructions: [{ text: "Jab", min: 10, sec: 0, order: 1 }],
        coolDownInstructions: [
          { text: "Étirements", min: 3, sec: 0, order: 1 },
        ],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      await request(app)
        .patch(`/lessons/${lessonId}/visibility`)
        .send({ token: userToken })

      const response = await request(app).get("/lessons")

      expect(response.status).toBe(200)
      expect(response.body.lessons).toHaveLength(1)
      expect(response.body.lessons[0].title).toBe("Boxe débutant")
    })
  })

  describe("GET /lessons/:id", () => {
    test("retourne une lesson par son ID", async () => {
      const lesson = {
        title: "Karaté kata",
        sport: "Karaté",
        objective: "Maîtriser le kata",
        warmUpInstructions: [{ text: "Kihon", min: 5, sec: 0, order: 1 }],
        bodyInstructions: [{ text: "Kata Heian", min: 15, sec: 0, order: 1 }],
        coolDownInstructions: [
          { text: "Méditation", min: 2, sec: 0, order: 1 },
        ],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      await request(app)
        .patch(`/lessons/${lessonId}/visibility`)
        .send({ token: userToken })

      const response = await request(app).get(`/lessons/${lessonId}`)

      expect(response.status).toBe(200)
      expect(response.body.lesson.title).toBe("Karaté kata")
      expect(response.body.lesson.warmUpInstructions).toHaveLength(1)
      expect(response.body.lesson.bodyInstructions).toHaveLength(1)
      expect(response.body.lesson.coolDownInstructions).toHaveLength(1)
    })

    test("retourne 404 si lesson non trouvée", async () => {
      const response = await request(app).get(
        "/lessons/550e8400-e29b-41d4-a716-446655440999"
      )

      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })
  })

  describe("POST /lessons", () => {
    test("crée une nouvelle lesson avec token valide", async () => {
      const lesson = {
        title: "MMA cardio",
        sport: "MMA",
        objective: "Améliorer endurance",
        warmUpInstructions: [{ text: "Burpees", min: 2, sec: 0, order: 1 }],
        bodyInstructions: [
          { text: "Combinaisons", min: 5, sec: 0, order: 1 },
          { text: "Entrées de jambes", min: 5, sec: 0, order: 2 },
        ],
        coolDownInstructions: [
          { text: "Marche lente", min: 3, sec: 0, order: 1 },
        ],
      }

      const response = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })

      expect(response.status).toBe(201)
      expect(response.body.message).toBe("succès")
      expect(response.body.lessonId).toBeDefined()

      const lessonId = response.body.lessonId

      await request(app)
        .patch(`/lessons/${lessonId}/visibility`)
        .send({ token: userToken })

      const allLessons = await request(app).get("/lessons")
      expect(allLessons.body.lessons).toHaveLength(1)
      expect(allLessons.body.lessons[0].bodyInstructions).toHaveLength(2)
    })

    test("retourne erreur si token invalide", async () => {
      const lesson = {
        title: "Test",
        sport: "Boxe",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [{ text: "Test", min: 1, sec: 0, order: 1 }],
        coolDownInstructions: [],
      }

      const response = await request(app)
        .post("/lessons")
        .send({ lesson, token: "invalid_token" })

      expect(response.status).toBe(403)
    })

    test("valide la transaction SQL avec CASCADE sur instructions", async () => {
      const lesson = {
        title: "Test Transaction",
        sport: "Judo",
        objective: "Test",
        warmUpInstructions: [
          { text: "Warm 1", min: 1, sec: 0, order: 1 },
          { text: "Warm 2", min: 2, sec: 0, order: 2 },
        ],
        bodyInstructions: [{ text: "Body 1", min: 5, sec: 0, order: 1 }],
        coolDownInstructions: [{ text: "Cool 1", min: 1, sec: 0, order: 1 }],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      expect(createResponse.status).toBe(201)
      expect(lessonId).toBeDefined()

      const toggleResponse = await request(app)
        .patch(`/lessons/${lessonId}/visibility`)
        .send({ token: userToken })

      expect(toggleResponse.status).toBe(200)

      const allLessons = await request(app).get("/lessons")
      expect(allLessons.status).toBe(200)
      expect(allLessons.body.lessons).toHaveLength(1)
      expect(allLessons.body.lessons[0].warmUpInstructions).toHaveLength(2)
    })
  })

  describe("PATCH /lessons/:id/visibility", () => {
    test("toggle la visibilité d\\'une lesson si owner", async () => {
      const lesson = {
        title: "Private Lesson",
        sport: "Boxe",
        objective: "Test visibility",
        warmUpInstructions: [],
        bodyInstructions: [{ text: "Test", min: 1, sec: 0, order: 1 }],
        coolDownInstructions: [],
      }

      await request(app).post("/lessons").send({ lesson, token: userToken })

      const allLessons = await request(app).get("/lessons")
      const lessonId = allLessons.body.lessons[0].lessonId
      const initialVisibility = allLessons.body.lessons[0].isPublic

      const response = await request(app)
        .patch(`/lessons/${lessonId}/visibility`)
        .send({ token: userToken })

      expect(response.status).toBe(200)

      const updatedLesson = await request(app).get(`/lessons/${lessonId}`)
      expect(updatedLesson.body.lesson.isPublic).toBe(!initialVisibility)
    })

    test("retourne 403 si pas owner de la lesson", async () => {
      const lesson = {
        title: "Other User Lesson",
        sport: "Karaté",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [{ text: "Test", min: 1, sec: 0, order: 1 }],
        coolDownInstructions: [],
      }

      await request(app).post("/lessons").send({ lesson, token: userToken })

      const otherUserResponse = await request(app).post("/users/sign-up").send({
        name: "OtherUser",
        email: "other@example.com",
        password: "password",
      })
      const otherToken = otherUserResponse.body.token

      const allLessons = await request(app).get("/lessons")
      const lessonId = allLessons.body.lessons[0].lessonId

      const response = await request(app)
        .patch(`/lessons/${lessonId}/visibility`)
        .send({ token: otherToken })

      expect(response.status).toBe(403)
    })

    test("retourne 404 si lesson non trouvée", async () => {
      const response = await request(app)
        .patch("/lessons/550e8400-e29b-41d4-a716-446655440999/visibility")
        .send({ token: userToken })

      expect(response.status).toBe(404)
    })

    test("retourne 401 si token invalide", async () => {
      const response = await request(app)
        .patch("/lessons/550e8400-e29b-41d4-a716-446655440999/visibility")
        .send({ token: "invalid_token" })

      expect(response.status).toBe(403)
    })
  })
})

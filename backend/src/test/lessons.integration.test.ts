import { describe, test, expect, beforeEach, afterAll } from "vitest"
import request from "supertest"
import { app } from "../presentation/app.js"
import { cleanDatabase, closeTestDatabase } from "./setup.js"
import { toTiptapJSON } from "./helpers/tiptapHelper.js"

describe("Lessons integration tests", () => {
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
          { text: toTiptapJSON("Échauffement"), min: 5, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Jab"), min: 10, sec: 0, order: 1 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Étirements"), min: 3, sec: 0, order: 1 },
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
        warmUpInstructions: [
          { text: toTiptapJSON("Kihon"), min: 5, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Kata Heian"), min: 15, sec: 0, order: 1 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Méditation"), min: 2, sec: 0, order: 1 },
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
        warmUpInstructions: [
          { text: toTiptapJSON("Burpees"), min: 2, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Combinaisons"), min: 5, sec: 0, order: 1 },
          { text: toTiptapJSON("Entrées de jambes"), min: 5, sec: 0, order: 2 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Marche lente"), min: 3, sec: 0, order: 1 },
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
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
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
          { text: toTiptapJSON("Warm 1"), min: 1, sec: 0, order: 1 },
          { text: toTiptapJSON("Warm 2"), min: 2, sec: 0, order: 2 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Body 1"), min: 5, sec: 0, order: 1 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Cool 1"), min: 1, sec: 0, order: 1 },
        ],
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

    test("retourne 409 si le titre existe déjà globalement", async () => {
      const lesson1 = {
        title: "Titre unique global",
        sport: "Boxe",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      await request(app)
        .post("/lessons")
        .send({ lesson: lesson1, token: userToken })

      const lesson2 = {
        title: "Titre unique global",
        sport: "Karaté",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const response = await request(app)
        .post("/lessons")
        .send({ lesson: lesson2, token: userToken })

      expect(response.status).toBe(409)
      expect(response.body.error).toBeDefined()
    })

    test("permet de créer une leçon avec un titre différent", async () => {
      const lesson1 = {
        title: "Titre A",
        sport: "Boxe",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const lesson2 = {
        title: "Titre B",
        sport: "Karaté",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const response1 = await request(app)
        .post("/lessons")
        .send({ lesson: lesson1, token: userToken })

      const response2 = await request(app)
        .post("/lessons")
        .send({ lesson: lesson2, token: userToken })

      expect(response1.status).toBe(201)
      expect(response2.status).toBe(201)
      expect(response1.body.lessonId).not.toBe(response2.body.lessonId)
    })
  })

  describe("PATCH /lessons/:id/visibility", () => {
    test("toggle la visibilité d\\'une lesson si owner", async () => {
      const lesson = {
        title: "Private Lesson",
        sport: "Boxe",
        objective: "Test visibility",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
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
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
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

  describe("POST /lessons/:id/duplicate", () => {
    test("duplique une lesson avec succès", async () => {
      const lesson = {
        title: "Leçon originale",
        sport: "Boxe",
        objective: "Test duplication",
        warmUpInstructions: [
          { text: toTiptapJSON("Échauffement"), min: 5, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Exercice"), min: 10, sec: 0, order: 1 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Retour au calme"), min: 3, sec: 0, order: 1 },
        ],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const originalLessonId = createResponse.body.lessonId

      const duplicateResponse = await request(app)
        .post(`/lessons/${originalLessonId}/duplicate`)
        .send({ token: userToken })

      expect(duplicateResponse.status).toBe(201)
      expect(duplicateResponse.body.lesson).toBeDefined()
      expect(duplicateResponse.body.lesson.title).toBe(
        "Leçon originale (copie)"
      )
      expect(duplicateResponse.body.lesson.isPublic).toBe(false)
      expect(duplicateResponse.body.lesson.sport).toBe("Boxe")
      expect(duplicateResponse.body.lesson.warmUpInstructions).toHaveLength(1)
      expect(duplicateResponse.body.lesson.bodyInstructions).toHaveLength(1)
      expect(duplicateResponse.body.lesson.coolDownInstructions).toHaveLength(1)
    })

    test("gère les titres en conflit avec (copie 2), (copie 3)", async () => {
      const lesson = {
        title: "Leçon test",
        sport: "Karaté",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const duplicate1 = await request(app)
        .post(`/lessons/${lessonId}/duplicate`)
        .send({ token: userToken })
      expect(duplicate1.body.lesson.title).toBe("Leçon test (copie)")

      const duplicate2 = await request(app)
        .post(`/lessons/${lessonId}/duplicate`)
        .send({ token: userToken })
      expect(duplicate2.body.lesson.title).toBe("Leçon test (copie 2)")

      const duplicate3 = await request(app)
        .post(`/lessons/${lessonId}/duplicate`)
        .send({ token: userToken })
      expect(duplicate3.body.lesson.title).toBe("Leçon test (copie 3)")
    })

    test("retourne 404 si lesson n'existe pas", async () => {
      const response = await request(app)
        .post("/lessons/550e8400-e29b-41d4-a716-446655440999/duplicate")
        .send({ token: userToken })

      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })

    test("permet à un autre utilisateur de dupliquer une leçon", async () => {
      const lesson = {
        title: "Leçon partagée",
        sport: "MMA",
        objective: "Test duplication par autre utilisateur",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const otherUserResponse = await request(app).post("/users/sign-up").send({
        name: "OtherUser2",
        email: "other2@example.com",
        password: "password",
      })
      const otherToken = otherUserResponse.body.token

      const response = await request(app)
        .post(`/lessons/${lessonId}/duplicate`)
        .send({ token: otherToken })

      expect(response.status).toBe(201)
      expect(response.body.lesson).toBeDefined()
      expect(response.body.lesson.title).toBe("Leçon partagée (copie)")
    })

    test("retourne 403 si token invalide", async () => {
      const response = await request(app)
        .post("/lessons/550e8400-e29b-41d4-a716-446655440999/duplicate")
        .send({ token: "invalid_token" })

      expect(response.status).toBe(403)
    })
  })

  describe("DELETE /lessons/:id", () => {
    test("supprime une leçon avec succès si owner", async () => {
      const lesson = {
        title: "Leçon à supprimer",
        sport: "Boxe",
        objective: "Test suppression",
        warmUpInstructions: [
          { text: toTiptapJSON("Échauffement"), min: 5, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Exercice"), min: 10, sec: 0, order: 1 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Retour au calme"), min: 3, sec: 0, order: 1 },
        ],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const deleteResponse = await request(app)
        .delete(`/lessons/${lessonId}`)
        .send({ token: userToken })

      expect(deleteResponse.status).toBe(200)
      expect(deleteResponse.body.message).toBe("Leçon supprimée avec succès")

      const getResponse = await request(app).get(`/lessons/${lessonId}`)
      expect(getResponse.status).toBe(404)
    })

    test("retourne 404 si leçon n'existe pas", async () => {
      const response = await request(app)
        .delete("/lessons/550e8400-e29b-41d4-a716-446655440999")
        .send({ token: userToken })

      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })

    test("retourne 403 si utilisateur n'est pas owner", async () => {
      const lesson = {
        title: "Leçon d'un autre utilisateur",
        sport: "Karaté",
        objective: "Test ownership",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const otherUserResponse = await request(app).post("/users/sign-up").send({
        name: "OtherUser3",
        email: "other3@example.com",
        password: "password",
      })
      const otherToken = otherUserResponse.body.token

      const deleteResponse = await request(app)
        .delete(`/lessons/${lessonId}`)
        .send({ token: otherToken })

      expect(deleteResponse.status).toBe(403)
      expect(deleteResponse.body.error).toBeDefined()
    })

    test("retourne 403 si token invalide", async () => {
      const response = await request(app)
        .delete("/lessons/550e8400-e29b-41d4-a716-446655440999")
        .send({ token: "invalid_token" })

      expect(response.status).toBe(403)
    })

    test("vérifie que les instructions sont supprimées (CASCADE)", async () => {
      const lesson = {
        title: "Leçon avec instructions",
        sport: "MMA",
        objective: "Test CASCADE",
        warmUpInstructions: [
          { text: toTiptapJSON("Warm 1"), min: 1, sec: 0, order: 1 },
          { text: toTiptapJSON("Warm 2"), min: 2, sec: 0, order: 2 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Body 1"), min: 5, sec: 0, order: 1 },
          { text: toTiptapJSON("Body 2"), min: 5, sec: 0, order: 2 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Cool 1"), min: 1, sec: 0, order: 1 },
        ],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      await request(app)
        .patch(`/lessons/${lessonId}/visibility`)
        .send({ token: userToken })

      const beforeDelete = await request(app).get(`/lessons/${lessonId}`)
      expect(beforeDelete.status).toBe(200)
      expect(beforeDelete.body.lesson.warmUpInstructions).toHaveLength(2)
      expect(beforeDelete.body.lesson.bodyInstructions).toHaveLength(2)
      expect(beforeDelete.body.lesson.coolDownInstructions).toHaveLength(1)

      await request(app)
        .delete(`/lessons/${lessonId}`)
        .send({ token: userToken })

      const afterDelete = await request(app).get(`/lessons/${lessonId}`)
      expect(afterDelete.status).toBe(404)
    })
  })

  describe("PUT /lessons/:id", () => {
    test("met à jour une leçon avec succès si owner", async () => {
      const lesson = {
        title: "Leçon originale",
        sport: "Boxe",
        objective: "Objectif original",
        warmUpInstructions: [
          { text: toTiptapJSON("Warm 1"), min: 5, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Body 1"), min: 10, sec: 0, order: 1 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Cool 1"), min: 3, sec: 0, order: 1 },
        ],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const updatedLesson = {
        title: "Leçon mise à jour",
        sport: "Karaté",
        objective: "Objectif modifié",
        warmUpInstructions: [
          { text: toTiptapJSON("New Warm 1"), min: 3, sec: 0, order: 1 },
          { text: toTiptapJSON("New Warm 2"), min: 2, sec: 0, order: 2 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("New Body 1"), min: 15, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const updateResponse = await request(app)
        .put(`/lessons/${lessonId}`)
        .send({ lesson: updatedLesson, token: userToken })

      expect(updateResponse.status).toBe(200)
      expect(updateResponse.body.lesson.title).toBe("Leçon mise à jour")
      expect(updateResponse.body.lesson.sport).toBe("Karaté")
      expect(updateResponse.body.lesson.objective).toBe("Objectif modifié")
      expect(updateResponse.body.lesson.warmUpInstructions).toHaveLength(2)
      expect(updateResponse.body.lesson.bodyInstructions).toHaveLength(1)
      expect(updateResponse.body.lesson.coolDownInstructions).toHaveLength(0)
    })

    test("met à jour le titre, sport, objective, et instructions", async () => {
      const lesson = {
        title: "Test Update",
        sport: "MMA",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Original"), min: 5, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const updatedLesson = {
        title: "Updated Test",
        sport: "Judo",
        objective: "Updated objective",
        warmUpInstructions: [
          { text: toTiptapJSON("Warm"), min: 5, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Updated 1"), min: 10, sec: 0, order: 1 },
          { text: toTiptapJSON("Updated 2"), min: 5, sec: 0, order: 2 },
        ],
        coolDownInstructions: [
          { text: toTiptapJSON("Cool"), min: 2, sec: 0, order: 1 },
        ],
      }

      const updateResponse = await request(app)
        .put(`/lessons/${lessonId}`)
        .send({ lesson: updatedLesson, token: userToken })

      expect(updateResponse.status).toBe(200)
      const result = updateResponse.body.lesson
      expect(result.title).toBe("Updated Test")
      expect(result.sport).toBe("Judo")
      expect(result.objective).toBe("Updated objective")
      expect(result.warmUpInstructions[0].text).toEqual(toTiptapJSON("Warm"))
      expect(result.bodyInstructions).toHaveLength(2)
      expect(result.coolDownInstructions[0].text).toEqual(toTiptapJSON("Cool"))
    })

    test("retourne 404 si leçon n'existe pas", async () => {
      const lesson = {
        title: "Test",
        sport: "Boxe",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const response = await request(app)
        .put("/lessons/550e8400-e29b-41d4-a716-446655440999")
        .send({ lesson, token: userToken })

      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })

    test("retourne 403 si utilisateur n'est pas owner", async () => {
      const lesson = {
        title: "Leçon d'un autre",
        sport: "Boxe",
        objective: "Test ownership",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const otherUserResponse = await request(app).post("/users/sign-up").send({
        name: "OtherUser4",
        email: "other4@example.com",
        password: "password",
      })
      const otherToken = otherUserResponse.body.token

      const updatedLesson = {
        title: "Tentative de modification",
        sport: "Karaté",
        objective: "Hack",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Hack"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const updateResponse = await request(app)
        .put(`/lessons/${lessonId}`)
        .send({ lesson: updatedLesson, token: otherToken })

      expect(updateResponse.status).toBe(403)
      expect(updateResponse.body.error).toBeDefined()
    })

    test("retourne 403 si token invalide", async () => {
      const lesson = {
        title: "Test",
        sport: "Boxe",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const response = await request(app)
        .put("/lessons/550e8400-e29b-41d4-a716-446655440999")
        .send({ lesson, token: "invalid_token" })

      expect(response.status).toBe(403)
    })

    test("retourne 409 si le nouveau titre existe déjà", async () => {
      const lesson1 = {
        title: "Titre existant",
        sport: "Boxe",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const lesson2 = {
        title: "Titre différent",
        sport: "Karaté",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      await request(app)
        .post("/lessons")
        .send({ lesson: lesson1, token: userToken })

      const createResponse2 = await request(app)
        .post("/lessons")
        .send({ lesson: lesson2, token: userToken })
      const lessonId2 = createResponse2.body.lessonId

      const updatedLesson = {
        title: "Titre existant",
        sport: "MMA",
        objective: "Updated",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const updateResponse = await request(app)
        .put(`/lessons/${lessonId2}`)
        .send({ lesson: updatedLesson, token: userToken })

      expect(updateResponse.status).toBe(409)
      expect(updateResponse.body.error).toBeDefined()
    })

    test("permet de mettre à jour une leçon en gardant le même titre", async () => {
      const lesson = {
        title: "Titre constant",
        sport: "Boxe",
        objective: "Objectif original",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 5, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const createResponse = await request(app)
        .post("/lessons")
        .send({ lesson, token: userToken })
      const lessonId = createResponse.body.lessonId

      const updatedLesson = {
        title: "Titre constant",
        sport: "Karaté",
        objective: "Objectif modifié",
        warmUpInstructions: [
          { text: toTiptapJSON("Nouveau warm"), min: 3, sec: 0, order: 1 },
        ],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 5, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const updateResponse = await request(app)
        .put(`/lessons/${lessonId}`)
        .send({ lesson: updatedLesson, token: userToken })

      expect(updateResponse.status).toBe(200)
      expect(updateResponse.body.lesson.title).toBe("Titre constant")
      expect(updateResponse.body.lesson.sport).toBe("Karaté")
      expect(updateResponse.body.lesson.objective).toBe("Objectif modifié")
    })

    test("permet de mettre à jour vers un nouveau titre unique", async () => {
      const lesson1 = {
        title: "Titre A",
        sport: "Boxe",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const lesson2 = {
        title: "Titre B",
        sport: "Karaté",
        objective: "Test",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      await request(app)
        .post("/lessons")
        .send({ lesson: lesson1, token: userToken })

      const createResponse2 = await request(app)
        .post("/lessons")
        .send({ lesson: lesson2, token: userToken })
      const lessonId2 = createResponse2.body.lessonId

      const updatedLesson = {
        title: "Titre C nouveau",
        sport: "MMA",
        objective: "Updated",
        warmUpInstructions: [],
        bodyInstructions: [
          { text: toTiptapJSON("Test"), min: 1, sec: 0, order: 1 },
        ],
        coolDownInstructions: [],
      }

      const updateResponse = await request(app)
        .put(`/lessons/${lessonId2}`)
        .send({ lesson: updatedLesson, token: userToken })

      expect(updateResponse.status).toBe(200)
      expect(updateResponse.body.lesson.title).toBe("Titre C nouveau")
    })
  })
})

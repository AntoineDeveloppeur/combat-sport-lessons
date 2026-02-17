import { describe, test, expect } from "vitest"
import { getYupValidationSchema } from "./getInstructionYupValidationSchema"

describe("getYupValidationSchema", () => {
  describe("Schema creation", () => {
    test("should return a Yup schema for warmUpInstructions", () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      expect(schema).toBeDefined()
    })

    test("should return a Yup schema for bodyInstructions", () => {
      const schema = getYupValidationSchema("bodyInstructions")
      expect(schema).toBeDefined()
    })

    test("should return a Yup schema for coolDownInstructions", () => {
      const schema = getYupValidationSchema("coolDownInstructions")
      expect(schema).toBeDefined()
    })
  })

  describe("Valid data", () => {
    test("should validate correct warmUpInstructions data", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [
          { text: "Échauffement cardio", min: 5, sec: 0 },
          { text: "Étirements dynamiques", min: 3, sec: 30 },
        ],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate correct bodyInstructions data", async () => {
      const schema = getYupValidationSchema("bodyInstructions")
      const validData = {
        bodyInstructions: [{ text: "Exercice principal", min: 10, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate minimum text length (3 characters)", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [{ text: "abc", min: 1, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate maximum text length (2000 characters)", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const longText = "a".repeat(2000)
      const validData = {
        warmUpInstructions: [{ text: longText, min: 1, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate minimum minutes (0)", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [{ text: "Test", min: 0, sec: 30 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate maximum minutes (90)", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [{ text: "Test", min: 90, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate minimum seconds (0)", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [{ text: "Test", min: 1, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate maximum seconds (59)", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [{ text: "Test", min: 1, sec: 59 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })
  })

  describe("Invalid data - text field", () => {
    test("should reject text shorter than 3 characters", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "ab", min: 1, sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "L'instruction doit contenir au moins 3 caractères"
      )
    })

    test("should reject text longer than 2000 characters", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const longText = "a".repeat(2001)
      const invalidData = {
        warmUpInstructions: [{ text: longText, min: 1, sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "L'instruction ne peut pas dépasser 2000 caractères"
      )
    })

    test("should reject missing text field", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ min: 1, sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "L'instruction est requise"
      )
    })

    test("should reject empty text", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "", min: 1, sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "L'instruction doit contenir au moins 3 caractères"
      )
    })
  })

  describe("Invalid data - min field", () => {
    test("should reject negative minutes", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "Test", min: -1, sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "Les minutes doivent être au minimum 0"
      )
    })

    test("should reject minutes greater than 90", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "Test", min: 91, sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "Les minutes ne peuvent pas dépasser 90"
      )
    })

    test("should reject missing min field", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "Test", sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "Les minutes sont requises"
      )
    })
  })

  describe("Invalid data - sec field", () => {
    test("should reject negative seconds", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "Test", min: 1, sec: -1 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "Les secondes doivent être au minimum 0"
      )
    })

    test("should reject seconds greater than 59", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "Test", min: 1, sec: 60 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "Les secondes ne peuvent pas dépasser 59"
      )
    })

    test("should reject missing sec field", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [{ text: "Test", min: 1 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "Les secondes sont requises"
      )
    })
  })

  describe("Array validation", () => {
    test("should validate multiple instructions", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [
          { text: "Instruction 1", min: 1, sec: 0 },
          { text: "Instruction 2", min: 2, sec: 30 },
          { text: "Instruction 3", min: 3, sec: 45 },
        ],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should validate empty array", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should reject if one instruction in array is invalid", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        warmUpInstructions: [
          { text: "Valid instruction", min: 1, sec: 0 },
          { text: "ab", min: 1, sec: 0 },
        ],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow(
        "L'instruction doit contenir au moins 3 caractères"
      )
    })
  })

  describe("Different field names", () => {
    test("should create schema with correct field name for warmUpInstructions", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const validData = {
        warmUpInstructions: [{ text: "Test", min: 1, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should create schema with correct field name for bodyInstructions", async () => {
      const schema = getYupValidationSchema("bodyInstructions")
      const validData = {
        bodyInstructions: [{ text: "Test", min: 1, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should create schema with correct field name for coolDownInstructions", async () => {
      const schema = getYupValidationSchema("coolDownInstructions")
      const validData = {
        coolDownInstructions: [{ text: "Test", min: 1, sec: 0 }],
      }

      await expect(schema.validate(validData)).resolves.toEqual(validData)
    })

    test("should reject data with wrong field name", async () => {
      const schema = getYupValidationSchema("warmUpInstructions")
      const invalidData = {
        bodyInstructions: [{ text: "Test", min: 1, sec: 0 }],
      }

      await expect(schema.validate(invalidData)).rejects.toThrow()
    })
  })
})

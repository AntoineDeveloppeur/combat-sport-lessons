import { describe, test, expect, vi } from "vitest"
import { createUser } from "./createUser.js"
import { EmailAlreadyUsed } from "../../domain/errors/EmailAlreadyUsed.js"
import { DuplicateUsername } from "../../domain/errors/DuplicateUsername.js"
import type { UserRepository } from "../../domain/repositories/userRepository.js"
import type { IdGenerator } from "../../domain/services/IdGenerator.js"
import type { PasswordHasher } from "../../domain/services/PasswordHasher.js"
import type { CreateUserRequest } from "../dto/CreateUserRequest.js"

describe("createUser use case", () => {
  const mockRequest: CreateUserRequest = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  }

  test("lance EmailAlreadyUsed si email existe déjà", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(true),
    }

    await expect(
      createUser(
        mockRequest,
        mockUserRepository as UserRepository,
        {} as IdGenerator,
        {} as PasswordHasher
      )
    ).rejects.toThrow(EmailAlreadyUsed)

    expect(mockUserRepository.isEmailAlreadyUsed).toHaveBeenCalledWith(
      "john@example.com"
    )
  })

  test("appelle passwordHasher.hash avec le password fourni", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
      isUsernameAlreadyUsed: vi.fn().mockResolvedValue(false),
      create: vi.fn().mockResolvedValue(undefined),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      hash: vi.fn().mockResolvedValue("hashed_password"),
    }

    const mockIdGenerator: Partial<IdGenerator> = {
      generate: vi.fn().mockReturnValue("generated-uuid"),
    }

    await createUser(
      mockRequest,
      mockUserRepository as UserRepository,
      mockIdGenerator as IdGenerator,
      mockPasswordHasher as PasswordHasher
    )

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith("password123")
  })

  test("appelle idGenerator.generate pour créer un userId", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
      isUsernameAlreadyUsed: vi.fn().mockResolvedValue(false),
      create: vi.fn().mockResolvedValue(undefined),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      hash: vi.fn().mockResolvedValue("hashed_password"),
    }

    const mockIdGenerator: Partial<IdGenerator> = {
      generate: vi.fn().mockReturnValue("generated-uuid"),
    }

    await createUser(
      mockRequest,
      mockUserRepository as UserRepository,
      mockIdGenerator as IdGenerator,
      mockPasswordHasher as PasswordHasher
    )

    expect(mockIdGenerator.generate).toHaveBeenCalled()
  })

  test("appelle userRepository.create avec le User correct", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
      isUsernameAlreadyUsed: vi.fn().mockResolvedValue(false),
      create: vi.fn().mockResolvedValue(undefined),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      hash: vi.fn().mockResolvedValue("hashed_password"),
    }

    const mockIdGenerator: Partial<IdGenerator> = {
      generate: vi.fn().mockReturnValue("generated-uuid"),
    }

    await createUser(
      mockRequest,
      mockUserRepository as UserRepository,
      mockIdGenerator as IdGenerator,
      mockPasswordHasher as PasswordHasher
    )

    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "generated-uuid",
        name: "John Doe",
        email: "john@example.com",
        hash: "hashed_password",
        role: "user",
      })
    )
  })

  test("retourne le userId généré", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
      isUsernameAlreadyUsed: vi.fn().mockResolvedValue(false),
      create: vi.fn().mockResolvedValue(undefined),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      hash: vi.fn().mockResolvedValue("hashed_password"),
    }

    const mockIdGenerator: Partial<IdGenerator> = {
      generate: vi.fn().mockReturnValue("my-generated-uuid"),
    }

    const result = await createUser(
      mockRequest,
      mockUserRepository as UserRepository,
      mockIdGenerator as IdGenerator,
      mockPasswordHasher as PasswordHasher
    )

    expect(result).toBe("my-generated-uuid")
  })

  test("ne crée pas l'utilisateur si email existe déjà", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(true),
      create: vi.fn(),
    }

    await expect(
      createUser(
        mockRequest,
        mockUserRepository as UserRepository,
        {} as IdGenerator,
        {} as PasswordHasher
      )
    ).rejects.toThrow(EmailAlreadyUsed)

    expect(mockUserRepository.create).not.toHaveBeenCalled()
  })

  test("lance DuplicateUsername si username existe déjà", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
      isUsernameAlreadyUsed: vi.fn().mockResolvedValue(true),
    }

    await expect(
      createUser(
        mockRequest,
        mockUserRepository as UserRepository,
        {} as IdGenerator,
        {} as PasswordHasher
      )
    ).rejects.toThrow(DuplicateUsername)

    expect(mockUserRepository.isUsernameAlreadyUsed).toHaveBeenCalledWith(
      "John Doe"
    )
  })

  test("ne crée pas l'utilisateur si username existe déjà", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
      isUsernameAlreadyUsed: vi.fn().mockResolvedValue(true),
      create: vi.fn(),
    }

    await expect(
      createUser(
        mockRequest,
        mockUserRepository as UserRepository,
        {} as IdGenerator,
        {} as PasswordHasher
      )
    ).rejects.toThrow(DuplicateUsername)

    expect(mockUserRepository.create).not.toHaveBeenCalled()
  })
})

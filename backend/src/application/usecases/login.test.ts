import { describe, test, expect, vi } from "vitest"
import { login } from "./login.js"
import type { UserRepository } from "../../domain/repositories/userRepository.js"
import type { PasswordHasher } from "../../domain/services/PasswordHasher.js"
import type { TokenManager } from "../../domain/services/TokenManager.js"

describe("login use case", () => {
  test("retourne token et userId avec credentials corrects", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(true),
    }

    const mockTokenManager: Partial<TokenManager> = {
      generateToken: vi.fn().mockResolvedValue("generated_token"),
    }

    const result = await login(
      "test@example.com",
      "password123",
      mockPasswordHasher as PasswordHasher,
      mockUserRepository as UserRepository,
      mockTokenManager as TokenManager
    )

    expect(result).toEqual({
      token: "generated_token",
      userId: "user-123",
    })
  })

  test("appelle userRepository.findUserId avec l'email", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(true),
    }

    const mockTokenManager: Partial<TokenManager> = {
      generateToken: vi.fn().mockResolvedValue("token"),
    }

    await login(
      "john@example.com",
      "password",
      mockPasswordHasher as PasswordHasher,
      mockUserRepository as UserRepository,
      mockTokenManager as TokenManager
    )

    expect(mockUserRepository.findUserId).toHaveBeenCalledWith(
      "john@example.com"
    )
  })

  test("appelle passwordHasher.verify avec password et hash", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash_value"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(true),
    }

    const mockTokenManager: Partial<TokenManager> = {
      generateToken: vi.fn().mockResolvedValue("token"),
    }

    await login(
      "test@example.com",
      "mypassword",
      mockPasswordHasher as PasswordHasher,
      mockUserRepository as UserRepository,
      mockTokenManager as TokenManager
    )

    expect(mockPasswordHasher.verify).toHaveBeenCalledWith(
      "mypassword",
      "stored_hash_value"
    )
  })

  test("lance erreur si credentials incorrects", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(false),
    }

    const mockTokenManager: Partial<TokenManager> = {
      generateToken: vi.fn(),
    }

    await expect(
      login(
        "test@example.com",
        "wrongpassword",
        mockPasswordHasher as PasswordHasher,
        mockUserRepository as UserRepository,
        mockTokenManager as TokenManager
      )
    ).rejects.toThrow("Identifiants incorrects")
  })

  test("ne génère pas de token si password incorrect", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(false),
    }

    const mockTokenManager: Partial<TokenManager> = {
      generateToken: vi.fn(),
    }

    try {
      await login(
        "test@example.com",
        "wrongpassword",
        mockPasswordHasher as PasswordHasher,
        mockUserRepository as UserRepository,
        mockTokenManager as TokenManager
      )
    } catch {
      // Expected error
    }

    expect(mockTokenManager.generateToken).not.toHaveBeenCalled()
  })

  test("appelle tokenManager.generateToken avec userId", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-456"),
      getHash: vi.fn().mockResolvedValue("stored_hash"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(true),
    }

    const mockTokenManager: Partial<TokenManager> = {
      generateToken: vi.fn().mockResolvedValue("token"),
    }

    await login(
      "test@example.com",
      "password",
      mockPasswordHasher as PasswordHasher,
      mockUserRepository as UserRepository,
      mockTokenManager as TokenManager
    )

    expect(mockTokenManager.generateToken).toHaveBeenCalledWith("user-456")
  })
})

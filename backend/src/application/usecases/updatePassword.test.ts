import { describe, test, expect, vi } from "vitest"
import { updatePassword } from "./updatePassword.js"
import { IncorrectCurrentPassword } from "../../domain/errors/IncorrectCurrentPassword.js"
import type { UserRepository } from "../../domain/repositories/userRepository.js"
import type { PasswordHasher } from "../../domain/services/PasswordHasher.js"

describe("updatePassword use case", () => {
  test("met à jour le password si current password est correct", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("old_hash"),
      updatePassword: vi.fn().mockResolvedValue(undefined),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(true),
      hash: vi.fn().mockResolvedValue("new_hash"),
    }

    await updatePassword(
      "test@example.com",
      "oldpassword",
      "newpassword",
      mockUserRepository as UserRepository,
      mockPasswordHasher as PasswordHasher,
    )

    expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
      "user-123",
      "new_hash",
    )
  })

  test("lance IncorrectCurrentPassword si current password incorrect", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(false),
    }

    await expect(
      updatePassword(
        "test@example.com",
        "wrongpassword",
        "newpassword",
        mockUserRepository as UserRepository,
        mockPasswordHasher as PasswordHasher,
      ),
    ).rejects.toThrow(IncorrectCurrentPassword)
  })

  test("appelle passwordHasher.verify avec current password et stored hash", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash_value"),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(false),
    }

    try {
      await updatePassword(
        "test@example.com",
        "currentpass",
        "newpass",
        mockUserRepository as UserRepository,
        mockPasswordHasher as PasswordHasher,
      )
    } catch (error) {
      // Expected error
    }

    expect(mockPasswordHasher.verify).toHaveBeenCalledWith(
      "currentpass",
      "stored_hash_value",
    )
  })

  test("appelle passwordHasher.hash avec new password", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("old_hash"),
      updatePassword: vi.fn().mockResolvedValue(undefined),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(true),
      hash: vi.fn().mockResolvedValue("new_hash"),
    }

    await updatePassword(
      "test@example.com",
      "oldpassword",
      "mynewpassword",
      mockUserRepository as UserRepository,
      mockPasswordHasher as PasswordHasher,
    )

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith("mynewpassword")
  })

  test("ne met pas à jour le password si current password incorrect", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("stored_hash"),
      updatePassword: vi.fn(),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(false),
    }

    try {
      await updatePassword(
        "test@example.com",
        "wrongpassword",
        "newpassword",
        mockUserRepository as UserRepository,
        mockPasswordHasher as PasswordHasher,
      )
    } catch (error) {
      // Expected error
    }

    expect(mockUserRepository.updatePassword).not.toHaveBeenCalled()
  })

  test("appelle userRepository.findUserId avec l'email", async () => {
    const mockUserRepository: Partial<UserRepository> = {
      findUserId: vi.fn().mockResolvedValue("user-123"),
      getHash: vi.fn().mockResolvedValue("hash"),
      updatePassword: vi.fn(),
    }

    const mockPasswordHasher: Partial<PasswordHasher> = {
      verify: vi.fn().mockResolvedValue(true),
      hash: vi.fn().mockResolvedValue("new_hash"),
    }

    await updatePassword(
      "john@example.com",
      "old",
      "new",
      mockUserRepository as UserRepository,
      mockPasswordHasher as PasswordHasher,
    )

    expect(mockUserRepository.findUserId).toHaveBeenCalledWith(
      "john@example.com",
    )
  })
})

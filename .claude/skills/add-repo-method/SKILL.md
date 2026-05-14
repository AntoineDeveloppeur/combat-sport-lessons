---
name: add-repo-method
description: >
  Checklist complète pour ajouter une méthode à un repository dans ce projet (architecture hexagonale).
  Déclencher ce skill dès que l'utilisateur veut ajouter une méthode à une interface repository,
  étendre un repository existant, ajouter une query ou opération DB via le pattern repository,
  ou mentionner "repository", "interface", "UserRepository", "LessonRepository".
  Ne pas déclencher pour des questions génériques sur les bases de données sans lien avec le pattern repository du projet.
---

Checklist complète — **toutes les étapes sont obligatoires**.

## 1. Ajouter la méthode à l'interface dans `domain/repositories/`

```typescript
export interface UserRepository {
  isUsernameAlreadyUsed(username: string): Promise<boolean>
}
```

## 2. Implémenter la méthode dans `infrastructure/postSQL/`

```typescript
async isUsernameAlreadyUsed(username: string): Promise<boolean> {
  const query = `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) as exists`
  const result = await this.pool.query(query, [username])
  return result.rows[0].exists
}
```

## 3. Mettre à jour TOUS les mocks dans les tests existants

Les tests TypeScript échoueront si le mock ne satisfait pas l'interface.

```typescript
// Avant — FAIL après ajout à l'interface
const mockUserRepository: Partial<UserRepository> = {
  isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
  create: vi.fn().mockResolvedValue(undefined),
}

// Après — OK
const mockUserRepository: Partial<UserRepository> = {
  isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
  isUsernameAlreadyUsed: vi.fn().mockResolvedValue(false), // ✅ Ajouté
  create: vi.fn().mockResolvedValue(undefined),
}
```

---
name: add-error
description: >
  Checklist complète pour créer une custom error class dans ce projet (architecture hexagonale).
  Déclencher ce skill dès que l'utilisateur veut créer une erreur personnalisée, ajouter de la
  gestion d'erreur côté backend, mentionner "error class", "custom error", "erreur métier",
  "throw", ou demander comment signaler un cas d'erreur dans un use case ou controller.
  Ne pas déclencher pour des erreurs JavaScript génériques sans lien avec l'architecture du projet.
---

Checklist complète — **toutes les étapes sont obligatoires**.

## 1. Créer la classe dans `domain/errors/[ErrorName].ts`

- Étend `Error`
- Propriété `status: number`
- Propriété `log` avec le contexte pertinent
- Appelle `super()` avec le message public

```typescript
export class DuplicateUsername extends Error {
  status: number = 409
  log: { logMessage: string; username: string }
  constructor(username: string) {
    const publicMessage = "Ce nom d'utilisateur est déjà utilisé"
    super(publicMessage)
    this.log = { logMessage: `Duplicate username: ${username}`, username }
  }
}
```

## 2. Mettre à jour le controller dans `presentation/controllers/`

- Importer la nouvelle classe
- Ajouter un bloc `if (error instanceof [ErrorName])` dans le catch
- Logger : `console.error(error.log)`
- Retourner : `res.status(error.status).json({ error: error.message })`

```typescript
import { DuplicateUsername } from "../../domain/errors/DuplicateUsername.js"

catch (error) {
  if (error instanceof DuplicateUsername) {
    console.error(error.log)
    return res.status(error.status).json({ error: error.message })
  }
}
```

## 3. Créer/mettre à jour les tests du use case

```typescript
await expect(
  createUser(...)
).rejects.toThrow(DuplicateUsername)
```

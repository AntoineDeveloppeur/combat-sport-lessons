---
name: testing
description: >
  Guidelines de tests pour ce projet (Vitest, React Testing Library, Playwright).
  Déclencher ce skill dès que l'utilisateur veut écrire ou comprendre des tests, demande
  comment tester un use case, un composant React, un flow E2E, où placer les fichiers de test,
  comment mocker un repository, ou pose une question sur Vitest, Testing Library ou Playwright
  dans le contexte de ce projet.
---

## Backend — Vitest

- Tests unitaires : même dossier que le module testé
- Tests d'intégration : `src/__test__/`
- Fichiers : `*.test.ts` ou `*.spec.ts`
- Mocker repositories et services via leurs interfaces

```bash
cd backend && npm run test
```

## Frontend — Vitest + Testing Library

- Tester les interactions utilisateur, pas les détails d'implémentation
- Utiliser React Testing Library

```bash
cd frontend && npm run test
```

## E2E — Playwright

- Dossier : `tests/integration/`
- Couvrir les flows critiques : sign-up, login, création de leçon

```bash
npm run test:e2e          # depuis la racine
npm run test:e2e:ui
npm run test:e2e:debug
```

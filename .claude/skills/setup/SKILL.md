---
name: setup
description: >
  Commandes d'installation et de développement du projet.
  Déclencher ce skill dès que l'utilisateur demande comment installer le projet, démarrer
  le serveur de développement, lancer la base de données, connaître les commandes npm
  disponibles, ou pose une question du type "comment je lance le projet ?",
  "comment installer ?", "comment démarrer le backend/frontend ?".
---

## Installation initiale

```bash
npm install
cd backend && npm install
cd frontend && npm install
cd backend && npm run db:start
```

## Backend

```bash
cd backend
npm run type:watch   # Terminal 1 — TypeScript watch
npm run dev          # Terminal 2 — serveur nodemon

npm run test
npm run test:ui

npm run db:start
npm run db:stop
npm run db:reset
```

## Frontend

```bash
cd frontend
npm run dev

npm run test
npm run test:ui
npm run test:coverage
```

## Tests E2E (depuis la racine)

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:debug
```

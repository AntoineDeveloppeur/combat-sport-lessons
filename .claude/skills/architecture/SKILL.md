---
name: architecture
description: >
  Structure détaillée du projet (backend hexagonal + frontend Next.js).
  Déclencher ce skill dès que l'utilisateur demande où placer un fichier, comment est organisé
  le projet, quelle couche est responsable de quoi, la différence entre domain/application/
  infrastructure/presentation, ou pose une question du type "où dois-je mettre X ?",
  "dans quel dossier ?", "quelle est la structure du projet ?".
---

## Backend `backend/src/`

```
├── domain/              # Logique métier (framework-agnostic)
│   ├── entities/        # Entités (User, Lesson)
│   ├── repositories/    # Interfaces des repositories
│   ├── services/        # Interfaces des services (Hasher, TokenManager)
│   ├── errors/          # Custom error classes
│   └── utils/           # Types et utilitaires
│
├── application/
│   └── usecases/        # Cas d'usage (orchestration)
│
├── infrastructure/
│   ├── postSQL/         # Implémentations PostgreSQL
│   └── services/        # Implémentations concrètes des services
│
└── presentation/
    ├── controllers/     # Controllers Express
    └── routes/          # Définitions des routes
```

**Règles :**
- Le domain n'importe aucun framework
- Les use cases dépendent d'interfaces, jamais d'implémentations concrètes
- L'injection de dépendances se fait au niveau des controllers

## Frontend `frontend/`

```
├── app/                 # Next.js App Router
│   ├── (app)/          # Routes authentifiées
│   ├── (auth)/         # Routes publiques
│   └── layout.tsx
│
├── components/
│   ├── ui/             # Composants shadcn/ui
│   ├── form/           # Composants de formulaires
│   ├── lessonTable/    # Composants tableau
│   └── landing/        # Composants landing page
│
├── store/
│   └── api/            # RTK Query slices
│
├── contexts/
├── lib/
├── types/
└── utils/
```

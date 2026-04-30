# Combat Sport Lessons 🥋

> Application full-stack pour créer, gérer et partager des plans de leçons de
> sports de combat. Projet d'apprentissage open-source avec architecture
> hexagonale et stack moderne.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## ✨ Fonctionnalités

- 📝 **Créer et gérer** des leçons de sport de combat structurées
- 🔐 **Authentification sécurisée** avec JWT et Google reCAPTCHA v3
- 👥 **Partage de leçons** publiques entre utilisateurs
- 🎨 **Interface moderne** avec Next.js 16, React 19 et TailwindCSS
- 🏗️ **Architecture hexagonale** pour une meilleure maintenabilité
- 🧪 **Tests complets** : unitaires, intégration et E2E

---

## 📦 Stack Technique

### Backend

- **Runtime** : Node.js + TypeScript 5.9
- **Framework** : Express 5
- **Base de données** : PostgreSQL 16 (Docker)
- **Authentification** : JWT + bcrypt
- **Tests** : Vitest + Supertest
- **Architecture** : Hexagonale (ports & adapters)

### Frontend

- **Framework** : Next.js 16 (App Router)
- **UI Library** : React 19
- **Styling** : TailwindCSS 4 + shadcn/ui
- **State Management** : Redux Toolkit + RTK Query
- **Forms** : React Hook Form + Yup
- **Tests** : Vitest + Testing Library

### DevOps & Outils

- **Monorepo** : npm workspaces
- **Containerization** : Docker + Docker Compose
- **Linting** : ESLint
- **Formatting** : Prettier
- **Git Hooks** : Husky + lint-staged
- **Commits** : Commitlint (conventional commits)
- **E2E Tests** : Playwright

---

## 🚀 Quick Start

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- ✅ [Docker Desktop](https://www.docker.com/products/docker-desktop)
  **(obligatoire)**
- ✅ [Node.js](https://nodejs.org/) v18 ou supérieur

### Installation en 5 Étapes

```bash
# 1️⃣ Cloner le repository
git clone https://github.com/AntoineDeveloppeur/combat-sport-lessons.git
cd combat-sport-lessons

# 2️⃣ Installer les dépendances
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3️⃣ Configurer les variables d'environnement
cp .env.example .env
# ⚠️ Éditez .env et configurez au minimum JWT_SECRET et les mots de passe

# 4️⃣ Démarrer Docker Desktop puis PostgreSQL
cd backend
npm run db:start

# 5️⃣ Dans des terminaux séparés, lancer :
# Terminal 1 : Compilation TypeScript backend
cd backend && npm run type:watch

# Terminal 2 : Serveur backend
cd backend && npm run dev

# Terminal 3 : Serveur frontend
cd frontend && npm run dev
```

### 🎉 Accès à l'Application

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **Backend API** : [http://localhost:4000](http://localhost:4000)
- **PgAdmin** (optionnel) : [http://localhost:8888](http://localhost:8888)

---

## ⚙️ Configuration

### Variables d'Environnement

**IMPORTANT** : Toutes les variables d'environnement doivent être dans le
fichier `.env` **à la racine du projet**, pas dans `backend/` ou `frontend/`.

1. Copiez le template :

   ```bash
   cp .env.example .env
   ```

2. Éditez `.env` et configurez les variables essentielles :

   ```bash
   # JWT Secret (OBLIGATOIRE - générez une chaîne aléatoire de 32+ caractères)
   JWT_SECRET=votre_secret_jwt_tres_securise_ici

   # Mots de passe PostgreSQL
   POSTGRES_PASSWORD=votre_mot_de_passe_securise
   POSTGRES_TEST_PASSWORD=votre_mot_de_passe_test
   ```

3. **reCAPTCHA** (optionnel pour développement local) :
   - Pour le développement, vous pouvez utiliser les clés de test fournies dans
     `.env.example`
   - Pour la production, obtenez vos clés sur
     [Google reCAPTCHA](https://www.google.com/recaptcha/admin)

---

## 🗄️ Base de Données

### Démarrage Standard

```bash
cd backend
npm run db:start
```

Cela démarre **PostgreSQL** (dev + test) via Docker.

### Avec PgAdmin (Optionnel)

Si vous souhaitez utiliser l'interface graphique PgAdmin :

```bash
cd backend
npm run db:start:tools
```

**Accès PgAdmin** : [http://localhost:8888](http://localhost:8888)

- Email : Voir `PGADMIN_EMAIL` dans `.env`
- Mot de passe : Voir `PGADMIN_PASSWORD` dans `.env`

### Commandes Utiles

```bash
cd backend

npm run db:start        # Démarrer PostgreSQL
npm run db:stop         # Arrêter PostgreSQL
npm run db:reset        # Réinitialiser la base de données
npm run db:start:tools  # Démarrer PostgreSQL + PgAdmin
```

---

## 🏗️ Architecture

### Vue d'Ensemble

Ce projet suit une **architecture hexagonale** (ports & adapters) avec un
monorepo npm workspaces.

```
combat-sport-lessons/
├── backend/           # API REST avec architecture hexagonale
│   ├── domain/        # Business logic (framework-agnostic)
│   ├── application/   # Use cases
│   ├── infrastructure/# Implémentations techniques (PostgreSQL, services)
│   └── presentation/  # HTTP layer (Express, controllers, routes)
│
├── frontend/          # Application Next.js 16
│   ├── app/          # App Router (routes)
│   ├── components/   # Composants React + shadcn/ui
│   ├── store/        # Redux Toolkit + RTK Query
│   └── contexts/     # React contexts (Auth)
│
├── tests/            # Tests E2E Playwright
└── config/           # Configuration partagée (ESLint, Prettier, Commitlint)
```

### Backend : Architecture Hexagonale

```
backend/src/
├── domain/              # Cœur métier (indépendant de toute technologie)
│   ├── entities/        # User, Lesson
│   ├── repositories/    # Interfaces des repositories
│   ├── services/        # Interfaces (Hasher, TokenManager)
│   └── errors/          # Classes d'erreurs custom
│
├── application/         # Use cases (orchestration)
│   └── usecases/        # CreateLesson, UpdateLesson, etc.
│
├── infrastructure/      # Implémentations techniques
│   ├── postSQL/         # PostgreSQL repositories
│   └── services/        # bcrypt, JWT, UUID
│
└── presentation/        # HTTP layer
    ├── controllers/     # Express controllers
    └── routes/          # Route definitions
```

**Principes clés** :

- Le domaine est **indépendant** de tout framework
- Les use cases dépendent d'**interfaces**, pas d'implémentations
- Injection de dépendances au niveau des contrôleurs

### Frontend : Next.js + React

- **Server Components** par défaut pour de meilleures performances
- **Client Components** (`"use client"`) pour l'interactivité
- **shadcn/ui** pour les composants UI réutilisables
- **TailwindCSS** pour le styling utility-first
- **Redux Toolkit** avec RTK Query pour la gestion d'état et les appels API

Pour plus de détails techniques, consultez
[`config/AGENTS.md`](config/AGENTS.md).

---

## 🧪 Tests

### ⚠️ RÈGLE IMPORTANTE

**NE JAMAIS commit avec les tests en mode watch !**

Lorsque vous commentez, les tests seraient lancé par le commit et par le watch
en même ce qui entraînerait des interférences. **Arrêtez toujours le mode watch
avant de commit.**

### Commandes de Test

```bash
# Backend
cd backend
npm run test              # Mode watch (développement)
npm run test:coverage     # Coverage sans watch

# Frontend
cd frontend
npm run test              # Mode watch (développement)
npm run test:coverage     # Coverage sans watch

# E2E (depuis la racine)
npm run test:e2e          # Tests Playwright headless
npm run test:e2e:ui       # Avec interface UI
npm run test:e2e:debug    # Mode debug
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Ce projet est un espace d'apprentissage
ouvert à tous les niveaux.

### Comment Contribuer ?

1. **Lisez le guide** : [`CONTRIBUTING.md`](CONTRIBUTING.md)
2. **Forkez** le repository
3. **Créez une branche** : `git checkout -b feat/ma-feature`
4. **Commitez** en français :
   `git commit -m "feat: ajout nouvelle fonctionnalité"`
5. **Pushez** : `git push origin feat/ma-feature`
6. **Ouvrez une Pull Request**

### Règles Importantes

- **Code comments** : ANGLAIS
- **Commits** : FRANÇAIS (conventional commits)
- **Tests** : Toujours inclure des tests
- **Formatage** : Lancez Prettier avant de commit

### Documentation pour AI Assistants

Si vous utilisez un assistant IA (Cascade, Copilot, etc.), ajoutez
[`config/AGENTS.md`](config/AGENTS.md) comme contexte pour une meilleure
compréhension du projet.

---

## 📄 Licence

Ce projet est sous licence **AGPL-3.0-only** avec clauses additionnelles.

**En résumé** :

- ✅ **Autorisé** : Fork pour contribuer, étudier le code, exécuter localement
- ❌ **Interdit** : Usage commercial, déploiement indépendant, distribution
  séparée

**Fork pour contribuer** via Pull Request est **encouragé** ! 🎉

Consultez [`LICENSE`](LICENSE) pour les détails complets.

---

## 🎯 Objectifs Pédagogiques

Ce projet est avant tout un **exercice d'apprentissage** pour maîtriser :

- ✅ **Architecture hexagonale** : Séparation domaine/infrastructure
- ✅ **Repository Pattern** : Abstraction de la persistance
- ✅ **TypeScript avancé** : Interfaces, types stricts, injection de dépendances
- ✅ **SQL natif** : Requêtes PostgreSQL sans ORM
- ✅ **Next.js moderne** : App Router, Server Components, React 19
- ✅ **Tests complets** : Unitaires, intégration, E2E
- ✅ **DevOps** : Docker, CI/CD, monorepo

---

## 🐛 Problèmes & Questions

- **Bug** : Ouvrez une
  [issue](https://github.com/AntoineDeveloppeur/combat-sport-lessons/issues)
- **Question** : Consultez [`CONTRIBUTING.md`](CONTRIBUTING.md) ou ouvrez une
  issue
- **Documentation technique** : Voir [`config/AGENTS.md`](config/AGENTS.md)

---

## 🙏 Remerciements

Merci à tous les contributeurs qui participent à ce projet d'apprentissage !

**Happy coding!** 🚀

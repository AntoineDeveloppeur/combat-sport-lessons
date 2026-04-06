# 🏗️ Repository Pattern API

> Une API REST démontrant l'implémentation du Repository Pattern avec
> TypeScript, PostgreSQL et une architecture hexagonale.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Docker-blue.svg)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D.svg)](http://localhost:4000/api-docs)

---

## 🎯 Pourquoi ce projet ?

Ce projet est un exercice d'apprentissage approfondi visant à maîtriser :

- **Le Repository Pattern** : abstraction de la couche de persistance pour une
  meilleure testabilité et maintenabilité
- **SQL natif** : écriture de requêtes SQL brutes avec PostgreSQL (sans ORM)
- **Architecture hexagonale** : séparation stricte entre domaine, application et
  infrastructure
- **TypeScript avancé** : interfaces, injection de dépendances et typage fort

## 🚀 Testez l'API

### Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Installation rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer Docker Desktop

# 3. Démarrer PostgreSQL avec Docker
npm run db:start

# 4. Compiler TypeScript (dans un terminal séparé)
npm run type:watch

# 5. Lancer le serveur (dans un autre terminal)
npm run dev
```

### 🎉 Accédez à Swagger

Ouvrez votre navigateur :
**[http://localhost:4000/api-docs](http://localhost:4000/api-docs)**

Vous pouvez immédiatement tester les endpoints avec l'interface interactive !
Vous pouvez

- Créer un utilisateur
- Modifier le mot de passe

## 🏛️ Architecture

Le projet suit une **architecture hexagonale** (ports & adapters) :

```
src/
├── domain/              # Cœur métier (indépendant de toute technologie)
│   ├── Entities/        # Entités métier (User)
│   ├── Repositories/    # Interfaces des repositories
│   ├── services/        # Interfaces des services (hasher, ID generator)
│   ├── errors/          # Classes d'erreurs custom
│   └── utils/           # Types et utilitaires
│
├── application/         # Cas d'usage (orchestration)
│   └── useCases/        # CreateUser, UpdatePassword
│
├── infrastructure/      # Implémentations techniques
│   ├── postSQL/         # Repository PostgreSQL + pool de connexion
│   └── services/        # Implémentations concrètes (bcrypt, UUID)
│
└── presentation/        # Couche HTTP
    ├── controllers/     # Contrôleurs Express
    ├── routes/          # Définition des routes
    └── swagger/         # Documentation OpenAPI
```

---

## 🔑 Concepts clés implémentés

### 1. Repository Pattern

Les **use cases** dépendent d'**interfaces**, pas d'implémentations concrètes :

```typescript
// ✅ Le use case utilise l'interface
class CreateUser {
  constructor(userRepository: UserRepository) {}
}

// ✅ L'implémentation concrète est injectée au runtime
const createUser = new CreateUser(new PostgreSQLUserRepository(pool))
```

### 2. Contrats définis dans le domaine

Tous les contrats (repositories, services) sont dans `src/domain/` :

- `UserRepository` : contrat pour la persistance des utilisateurs
- `Hasher` : contrat pour le hachage de mots de passe
- `IdGenerator` : contrat pour la génération d'identifiants uniques

### 3. Gestion d'erreurs centralisée

- Classes custom dans `src/domain/errors/` (ex: `EmailNotFound`,
  `EmailAlreadyExists`)
- Chaque erreur encapsule son message et son code HTTP
- Un seul bloc `try/catch` dans les contrôleurs pour gérer toutes les erreurs

### 4. Base de données PostgreSQL

- **Docker Compose** monte une instance PostgreSQL
- Initialisation automatique via `src/infrastructure/postSQL/init.sql`
- Pool de connexions géré dans `src/infrastructure/postSQL/postSQLPool.ts`
- Requêtes SQL natives avec paramètres sécurisés

---

## 🗄️ Base de données

La base de données est initialisée avec des **utilisateurs fictifs** pour
faciliter les tests.

---

## 📦 Stack technique

- **Runtime** : Node.js avec TypeScript
- **Framework** : Express 5
- **Base de données** : PostgreSQL (via Docker)
- **Hachage** : bcrypt
- **Documentation** : Swagger UI + OpenAPI
- **Outils** : ESLint, Prettier, Nodemon

## 📦 Tests

### backend

Il est nécessaire pour lancer les tests que la base de donnée SQL test soit
fonctionnelle

```
cd backend | npm run db:reset
autre terminal
cd backend | npm run test

```

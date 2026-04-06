# Guide de tests backend

Ce document explique la stratégie de tests mise en place pour le backend.

## Architecture de tests

### Tests E2E (End-to-End)

- **Localisation** : `src/__tests__/e2e/`
- **Objectif** : Valider l'infrastructure SQL, le plumbing et les flux complets
- **Couverture** : Happy paths + exceptions métier

### Tests unitaires

- **Localisation** : `src/application/usecases/__tests__/`
- **Objectif** : Tester la logique métier des use cases
- **Stratégie** : Utilisation de mocks pour isoler la logique

## Prérequis

### Base de données de test

Les tests E2E nécessitent une base PostgreSQL dédiée qui tourne sur le
port 5433.

**Démarrer les bases de données (dev + test)** :

```bash
npm run db:start
```

Cela démarre :

- `repository_pattern_db` sur le port 5432 (dev)
- `repository_pattern_test_db` sur le port 5433 (tests)

**Arrêter les bases** :

```bash
npm run db:stop
```

**Reset complet (supprime les données)** :

```bash
npm run db:reset
```

## Lancer les tests

### Tous les tests

```bash
npm run test:all
```

### Tests unitaires uniquement

```bash
npm run test:unit
```

### Tests E2E uniquement

```bash
npm run test:e2e
```

### Mode watch (développement)

```bash
npm test
```

### Interface UI Vitest

```bash
npm run test:ui
```

## Structure des tests

```
backend/
├── src/
│   ├── __tests__/
│   │   └── e2e/
│   │       ├── setup.ts              # Helpers pour nettoyer la DB
│   │       ├── users.e2e.test.ts     # Tests E2E users
│   │       └── lessons.e2e.test.ts   # Tests E2E lessons
│   ├── application/usecases/
│   │   ├── __tests__/
│   │   │   ├── createUser.test.ts
│   │   │   ├── login.test.ts
│   │   │   └── updatePassword.test.ts
│   │   └── lesson/__tests__/
│   │       └── toggleLessonVisibility.test.ts
│   └── infrastructure/postSQL/
│       ├── init.sql                  # Schema DB dev avec seed data
│       ├── init.test.sql             # Schema DB test sans seed data
│       ├── postSQLPool.ts            # Pool dev (port 5432)
│       ├── testPool.ts               # Pool test (port 5433)
│       └── poolFactory.ts            # Factory qui choisit le bon pool
```

## Stratégie de tests

### Ce qui est testé

#### Tests E2E

- ✅ Création d'utilisateur (POST /users)
- ✅ Login (POST /users/login)
- ✅ Mise à jour password (PUT /users/password)
- ✅ Récupération lessons (GET /lessons, GET /lessons/:id)
- ✅ Création lesson (POST /lessons)
- ✅ Toggle visibilité lesson (PATCH /lessons/:id/visibility)
- ✅ Validation des exceptions (409, 401, 403, 404)
- ✅ Transactions SQL avec CASCADE

#### Tests unitaires

- ✅ `createUser` : Validation email unique, génération hash/ID
- ✅ `login` : Vérification credentials, génération token
- ✅ `updatePassword` : Validation current password
- ✅ `toggleLessonVisibility` : Vérification ownership

### Ce qui n'est PAS testé

❌ **Services infrastructure** (wrappers simples) :

- `BcryptPasswordHasher` : Responsabilité de bcrypt
- `RandomUUIDGenerator` : Responsabilité de Node.js crypto
- `JwtTokenManager` : Wrapper simple autour de jsonwebtoken

❌ **Use cases proxy** (pas de logique) :

- `getAllLessons` : Simple appel au repository
- `getLesson` : Simple appel au repository

**Raison** : Ces composants sont validés indirectement par les tests E2E.

## Nettoyage de la DB

Les tests E2E nettoient automatiquement la base de test avant chaque test via
`TRUNCATE CASCADE` sur toutes les tables.

## Variables d'environnement

Le fichier `.env` à la racine du projet doit contenir :

```
JWT_SECRET=your_secret_key_here
```

## CI/CD

Pour intégrer les tests dans un pipeline CI/CD :

```bash
# Démarrer Docker Compose en arrière-plan
docker-compose up -d

# Attendre que PostgreSQL soit prêt
sleep 5

# Lancer les tests
npm run test:all

# Arrêter Docker Compose
docker-compose down
```

## Troubleshooting

### Erreur "Connection refused" sur port 5433

- Vérifier que Docker Compose est démarré : `docker ps`
- Vérifier les logs : `docker logs repository_pattern_test_db`

### Tests qui échouent aléatoirement

- Vérifier que `cleanDatabase()` est bien appelé dans `beforeEach`
- Vérifier qu'il n'y a pas de tests parallèles qui modifient la même donnée

### Timeout sur les tests E2E

- Les tests E2E ont un timeout de 10s configuré dans `vitest.config.ts`
- Si nécessaire, augmenter `testTimeout` et `hookTimeout`
